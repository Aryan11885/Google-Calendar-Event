import os

from dotenv import load_dotenv
from google.oauth2.credentials import Credentials

load_dotenv()


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

GOOGLE_CLIENT_SECRET = os.getenv(
    "GOOGLE_CLIENT_SECRET"
)

GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI",
)


GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/calendar",
]


def create_credentials(
    refresh_token: str,
):
    return Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri=(
            "https://oauth2.googleapis.com/token"
        ),
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=GOOGLE_SCOPES,
    )