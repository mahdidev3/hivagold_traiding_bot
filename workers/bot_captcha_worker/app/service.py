import io
import logging
import os
import shutil
from typing import Iterable

import cv2
import numpy as np
import pytesseract
from PIL import Image
from pytesseract import TesseractError


_module_logger = logging.getLogger(__name__)


def _resolve_tesseract_cmd() -> str:
    # 1) Explicit env wins (works for Docker, Linux, Windows).
    env_cmd = os.getenv("TESSERACT_CMD")
    if env_cmd:
        return env_cmd

    # 2) PATH-based detection.
    which_cmd = shutil.which("tesseract")
    if which_cmd:
        return which_cmd

    # 3) Common Windows default fallback.
    windows_default = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(windows_default):
        return windows_default

    return "tesseract"


pytesseract.pytesseract.tesseract_cmd = _resolve_tesseract_cmd()
_module_logger.info(
    "Using Tesseract binary path: %s", pytesseract.pytesseract.tesseract_cmd
)


class CaptchaSolverService:
    """
    Service responsible for solving captcha images from raw bytes.
    """

    def __init__(self, logger: logging.Logger, code_length: int = 6, max_retry: int = 4):
        self.logger = logger
        self.code_length = max(1, code_length)
        self.max_retry = max(1, max_retry)

    def solve_from_bytes(self, image_bytes: bytes) -> str:
        self.logger.debug("Starting captcha solve for image_bytes=%s", len(image_bytes))
        img_bgr = self._decode_image(image_bytes)
        prepared_images = self._prepare_candidates(img_bgr)

        best_code = ""
        best_score = float("-inf")
        attempts = min(self.max_retry, len(prepared_images))

        for idx in range(attempts):
            prepared = prepared_images[idx]
            code, confidence = self._ocr_digits(prepared)
            score = self._score_candidate(code, confidence)

            self.logger.debug(
                "OCR attempt=%s/%s code='%s' length=%s confidence=%.2f score=%.2f",
                idx + 1,
                attempts,
                code,
                len(code),
                confidence,
                score,
            )

            if score > best_score:
                best_score = score
                best_code = code

            if len(code) == self.code_length and confidence >= 40.0:
                self.logger.info(
                    "Captcha solved on attempt=%s code_length=%s confidence=%.2f",
                    idx + 1,
                    len(code),
                    confidence,
                )
                return code

        if len(best_code) > self.code_length:
            best_code = best_code[: self.code_length]

        self.logger.info(
            "Captcha solve finished using best candidate code_length=%s expected=%s attempts=%s",
            len(best_code),
            self.code_length,
            attempts,
        )
        return best_code

    def _decode_image(self, image_bytes: bytes) -> np.ndarray:
        # Decode as color first, because captcha text is better separated in HSV.
        img_bgr = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        if img_bgr is not None:
            return img_bgr

        self.logger.debug("OpenCV decode failed, falling back to PIL decoder")
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

    def _prepare_candidates(self, img_bgr: np.ndarray) -> list[np.ndarray]:
        hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)

        masks: list[np.ndarray] = []
        hsv_ranges = [
            ((10, 60, 0), (40, 255, 242)),
            ((8, 40, 20), (45, 255, 255)),
            ((5, 30, 30), (50, 255, 255)),
        ]
        for lower, upper in hsv_ranges:
            mask = cv2.inRange(hsv, lower, upper)
            masks.append(mask)

        masks.append(cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1])
        masks.append(
            cv2.adaptiveThreshold(
                blurred,
                255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY_INV,
                31,
                2,
            )
        )

        prepared: list[np.ndarray] = []
        for mask in masks:
            prepared_mask = self._normalize_binary(mask)
            prepared.append(prepared_mask)

            # Variant 1: slightly thicken strokes.
            prepared.append(
                cv2.dilate(
                    prepared_mask,
                    cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)),
                    iterations=1,
                )
            )

            # Variant 2: slightly thin strokes.
            prepared.append(
                cv2.erode(
                    prepared_mask,
                    cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)),
                    iterations=1,
                )
            )
        return prepared

    def _normalize_binary(self, mask: np.ndarray) -> np.ndarray:
        # Remove the common thin horizontal noise line.
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (20, 1))
        horizontal_noise = cv2.morphologyEx(mask, cv2.MORPH_OPEN, horizontal_kernel)
        cleaned = cv2.subtract(mask, horizontal_noise)

        cleaned = cv2.morphologyEx(
            cleaned, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        )
        cleaned = cv2.morphologyEx(
            cleaned, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        )
        cleaned = cv2.medianBlur(cleaned, 3)

        ys, xs = np.where(cleaned > 0)
        if len(xs) and len(ys):
            x1, x2 = xs.min(), xs.max()
            y1, y2 = ys.min(), ys.max()
            cleaned = cleaned[y1 : y2 + 1, x1 : x2 + 1]
        else:
            # Keep a non-empty fallback to avoid passing an all-empty crop to OCR.
            cleaned = mask.copy()

        cleaned = cv2.copyMakeBorder(
            cleaned, 10, 10, 10, 10, cv2.BORDER_CONSTANT, value=0
        )
        return cv2.resize(cleaned, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)

    def _ocr_digits(self, prepared_image: np.ndarray) -> tuple[str, float]:
        ocr_modes = (7, 8, 13)
        best_code = ""
        best_confidence = 0.0
        nonzero = int(np.count_nonzero(prepared_image))
        if nonzero == 0:
            self.logger.debug("Skipping OCR for empty prepared image shape=%s", prepared_image.shape)
            return best_code, best_confidence

        for psm in ocr_modes:
            ocr_config = (
                f"--oem 3 --psm {psm} -c tessedit_char_whitelist=0123456789 "
                "-c classify_bln_numeric_mode=1"
            )
            try:
                data = pytesseract.image_to_data(
                    prepared_image,
                    config=ocr_config,
                    output_type=pytesseract.Output.DICT,
                )
            except TesseractError as exc:
                self.logger.warning(
                    "Tesseract failed for prepared image shape=%s nonzero=%s psm=%s error=%s",
                    prepared_image.shape,
                    nonzero,
                    psm,
                    exc,
                )
                continue

            digits = "".join(ch for chunk in data.get("text", []) for ch in chunk if ch.isdigit())
            conf_values = self._extract_confidences(data.get("conf", []))
            avg_conf = float(np.mean(conf_values)) if conf_values else 0.0

            if len(digits) > self.code_length:
                digits = digits[: self.code_length]

            if self._score_candidate(digits, avg_conf) > self._score_candidate(
                best_code, best_confidence
            ):
                best_code = digits
                best_confidence = avg_conf

            if len(digits) == self.code_length and avg_conf >= 50.0:
                break

        return best_code, best_confidence

    def _extract_confidences(self, values: Iterable[object]) -> list[float]:
        confidences: list[float] = []
        for value in values:
            try:
                number = float(value)
            except (TypeError, ValueError):
                continue
            if number >= 0:
                confidences.append(number)
        return confidences

    def _score_candidate(self, code: str, confidence: float) -> float:
        if not code:
            return float("-inf")
        length_distance = abs(len(code) - self.code_length)
        length_score = 100 - (length_distance * 30)
        return length_score + confidence
