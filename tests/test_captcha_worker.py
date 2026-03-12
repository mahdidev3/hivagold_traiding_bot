import unittest
from workers.captcha_worker import CaptchaWorker


class FakeApi:
    def get_captcha(self):
        class R:
            def raise_for_status(self):
                pass  # simulate successful request

            def json(self):
                return {"key": "123"}

            @property
            def content(self):
                with open("../images/sample_captcha_371694.png", "rb") as f:
                    return f.read()

        return R()


class TestCaptchaWorker(unittest.TestCase):
    def test_solve(self):

        api = FakeApi()

        worker = CaptchaWorker(api)

        key, code = worker.fetch_and_solve()
        print(code)
        self.assertEqual(key, "123")
        self.assertTrue(len(code) > 0)
        self.assertEqual(code, "371694")
