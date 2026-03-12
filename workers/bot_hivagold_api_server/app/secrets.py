from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding


oaep_padding = padding.OAEP(
    mgf=padding.MGF1(algorithm=hashes.SHA256()),
    algorithm=hashes.SHA256(),
    label=None,
)


def get_public_key_from_pem(public_key_pem: str) -> serialization.PublicFormat:
    if not public_key_pem:
        raise ValueError("Public key PEM is not provided")
    try:
        public_key = serialization.load_pem_public_key(public_key_pem.encode("utf-8"))
        return public_key
    except Exception as e:
        raise ValueError(f"Failed to load public key from PEM: {e}")


def encrypt_password(password: str, public_key: serialization.PublicFormat) -> str:
    if not password or not public_key:
        raise ValueError("Password and public key are required")

    try:
        return base64.b64encode(
            public_key.encrypt(password.encode("utf-8"), oaep_padding)
        ).decode("utf-8")
    except Exception as e:
        raise ValueError(f"Failed to encrypt password: {e}")
