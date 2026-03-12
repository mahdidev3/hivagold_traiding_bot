import logging

from config import Config


def setup_logger(config: Config) -> logging.Logger:
    level = (
        logging.DEBUG
        if config.ENVIRONMENT.strip().lower() == "development"
        else logging.INFO
    )

    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
        force=True,
    )

    logger = logging.getLogger("bot_captcha_worker")
    logger.setLevel(level)
    return logger
