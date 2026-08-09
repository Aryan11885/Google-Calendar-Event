import json
from pathlib import Path

from google_auth_oauthlib.flow import Flow

from app.core.google import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_SCOPES,
)


CREDENTIALS_FILE = (
    Path(__file__).resolve().parent.parent
    / "credentials"
    / "google_credentials.json"
)


def create_flow():

    with open(CREDENTIALS_FILE, "r") as file:
        client_config = json.load(file)

    flow = Flow.from_client_config(
        client_config,
        scopes=GOOGLE_SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )

    return flow


def get_google_authorization_url():

    flow = create_flow()

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )

    return authorization_url, state