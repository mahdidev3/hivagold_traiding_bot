import requests
import json
from pathlib import Path


def test_get_captcha_image():
    """Test fetching captcha image from the API"""
    max_attempts = 3
    verify_url = "https://demo.hivagold.com/api/user/api/captcha-verify/"
    captcha_image_url = "https://demo.hivagold.com/api/user/api/captcha-image/"
    local_server_url = "http://127.0.0.1:8000/solve"
    cookies = None

    for attempt in range(1, max_attempts + 1):
        print(f"\n[Attempt {attempt}/{max_attempts}]")

        # Step 1: Get captcha image
        print("Step 1: Getting captcha image...")
        response = requests.get(captcha_image_url)

        if response.status_code != 200:
            print(f"✗ Failed to get captcha image: {response.status_code}")
            exit(1)

        print("✓ Successfully fetched captcha image")
        response_data = response.json()
        image_url = response_data.get("image_url")
        captcha_key = response_data.get("captcha_key")

        if not image_url or not captcha_key:
            print("✗ Missing image_url or captcha_key in response")
            exit(1)

        full_image_url = f"https://demo.hivagold.com/api{image_url}"
        print(f"Image URL: {full_image_url}")
        print(f"Captcha Key: {captcha_key}")

        # Step 2: Solve captcha
        print("\nStep 2: Solving captcha...")
        payload = {"image_url": full_image_url}
        captcha_response = requests.post(local_server_url, json=payload)

        if captcha_response.status_code != 200:
            print(f"✗ Failed to solve captcha: {captcha_response.status_code}")
            exit(1)

        captcha_result = captcha_response.json()
        captcha_value = captcha_result.get("code")
        print(f"✓ Captcha solved successfully")
        print(f"Captcha Code: {captcha_value}")

        # Step 3: Verify captcha
        print("\nStep 3: Verifying captcha...")
        verify_payload = {"captcha_key": captcha_key, "captcha_value": captcha_value}
        verify_response = requests.post(verify_url, json=verify_payload)

        print(f"Status Code: {verify_response.status_code}")

        if verify_response.status_code == 200:
            # Step 3.1: Verified successfully - continue to login
            print(f"✓ Captcha verified successfully!")
            print(f"Response: {verify_response.json()}")

            # Get cookies from verify response
            session_cookies = None
            if verify_response.cookies:
                session_cookies = verify_response.cookies
                print(f"✓ Cookies obtained from verification: {dict(session_cookies)}")

            # Step 4: Login
            print("\nStep 4: Logging in...")
            login_url = "https://demo.hivagold.com/api/user/api/auth/login/"
            login_payload = {"username": "09133040700", "password": "Amir@700"}

            login_response = requests.post(
                login_url,
                json=login_payload,
                cookies=session_cookies,
            )

            print(f"Login Status Code: {login_response.status_code}")
            print(f"Login Response: {login_response.json()}")

            # Get cookies from login response
            login_cookies = None
            if login_response.cookies:
                login_cookies = login_response.cookies
                print(f"✓ Cookies obtained from login: {dict(login_cookies)}")

                # Save cookies to file
                cookies_data = {
                    "verify_cookies": dict(session_cookies) if session_cookies else {},
                    "login_cookies": dict(login_cookies),
                }
                cookies_file = Path("cookies.json")
                with open(cookies_file, "w") as f:
                    json.dump(cookies_data, f, indent=4)
                print(f"✓ Cookies saved to {cookies_file}")

            return {
                "captcha_key": captcha_key,
                "captcha_value": captcha_value,
                "status": "verified",
                "verify_cookies": session_cookies,
                "login_cookies": login_cookies,
                "login_response": login_response.json(),
            }

        elif verify_response.status_code == 400:
            # Step 3.2 or 3.3: Handle errors
            error_response = verify_response.json()
            error_msg = error_response.get("error", "Unknown error")
            print(f"✗ Error: {error_msg}")

            if error_msg == "کپچا اشتباه است.":
                # Step 3.2: Wrong captcha - retry from step 1
                if attempt < max_attempts:
                    print(
                        f"Wrong captcha, retrying... ({max_attempts - attempt} attempts left)"
                    )
                    continue
                else:
                    # Step 3.3: Failed after max attempts
                    print(
                        f"✗ Captcha verification failed after {max_attempts} attempts"
                    )
                    exit(1)
            else:
                # Step 3.3: Any other error - print and exit
                print(f"✗ Unexpected error: {error_msg}")
                exit(1)
        else:
            # Step 3.3: Unexpected status code
            print(f"✗ Unexpected status code: {verify_response.status_code}")
            exit(1)


if __name__ == "__main__":
    test_get_captcha_image()
