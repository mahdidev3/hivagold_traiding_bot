import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "workers" / "bot_auth_worker"))
sys.path.insert(0, str(ROOT / "workers" / "bot_trading_worker"))
sys.path.insert(0, str(ROOT / "workers" / "api_server"))
