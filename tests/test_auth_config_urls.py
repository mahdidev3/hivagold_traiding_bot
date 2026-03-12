from workers.bot_auth_worker.config import build_api_url


def test_build_api_url_from_base_and_path():
    assert build_api_url("https://demo.hivagold.com", "/api/user/api/auth/login/") == (
        "https://demo.hivagold.com/api/user/api/auth/login/"
    )


def test_build_api_url_with_trailing_and_no_leading_slash():
    assert build_api_url("https://demo.hivagold.com/", "api") == "https://demo.hivagold.com/api"
