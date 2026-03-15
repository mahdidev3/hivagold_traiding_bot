FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

# Runtime-only OS deps for pytesseract + OpenCV headless
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*



RUN python -m pip install --upgrade pip setuptools wheel

# Copy dependency definition first for better layer caching
COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt



# Copy only app runtime files (keeps image/context smaller)
COPY app ./app
COPY config.py ./
COPY run.py ./


EXPOSE 8005

CMD ["python", "run.py"]
