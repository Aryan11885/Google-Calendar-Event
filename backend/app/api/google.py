import os

import requests
from dotenv import load_dotenv

from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.doctor_google_repository import (
    create,
    get_by_doctor,
)


load_dotenv()


router = APIRouter(
    prefix="/api/google",
    tags=["Google"],
)


GOOGLE_CLIENT_ID = os.getenv(
    "GOOGLE_CLIENT_ID"
)

GOOGLE_CLIENT_SECRET = os.getenv(
    "GOOGLE_CLIENT_SECRET"
)

GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:8000/api/google/callback",
)


GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/calendar",
]


def create_google_flow():

    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,

            "auth_uri": (
                "https://accounts.google.com/o/oauth2/auth"
            ),

            "token_uri": (
                "https://oauth2.googleapis.com/token"
            ),

            "redirect_uris": [
                GOOGLE_REDIRECT_URI
            ],
        }
    }

    flow = Flow.from_client_config(
        client_config,
        scopes=GOOGLE_SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
        autogenerate_code_verifier=True,
    )

    return flow


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


# =========================================================
# GOOGLE LOGIN
# =========================================================

@router.get("/login")
def google_login(
    request: Request,
    doctor_id: str,
):

    # Save doctor ID temporarily in session.
    # We need this after Google redirects back.
    request.session["google_doctor_id"] = doctor_id

    flow = create_google_flow()

    authorization_url, state = (
        flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent",
        )
    )

    # Save OAuth state.
    request.session["google_state"] = state

    # Save PKCE verifier.
    if flow.code_verifier:

        request.session[
            "google_code_verifier"
        ] = flow.code_verifier

    return RedirectResponse(
        authorization_url
    )


# =========================================================
# GOOGLE CALLBACK
# =========================================================

@router.get("/callback")
def google_callback(
    request: Request,
    code: str,
    state: str,

    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # 1. Get saved OAuth information
    # -----------------------------------------------------

    saved_state = request.session.get(
        "google_state"
    )

    code_verifier = request.session.get(
        "google_code_verifier"
    )

    doctor_id = request.session.get(
        "google_doctor_id"
    )


    # -----------------------------------------------------
    # 2. Validate OAuth session
    # -----------------------------------------------------

    if not saved_state:

        return {
            "success": False,
            "error": (
                "Google OAuth session expired. "
                "Please login again."
            ),
        }


    if state != saved_state:

        return {
            "success": False,
            "error": "Invalid OAuth state.",
        }


    if not code_verifier:

        return {
            "success": False,
            "error": (
                "Missing PKCE code verifier. "
                "Please login again."
            ),
        }


    if not doctor_id:

        return {
            "success": False,
            "error": (
                "Doctor ID missing. "
                "Please login again."
            ),
        }


    # -----------------------------------------------------
    # 3. Create Google OAuth flow again
    # -----------------------------------------------------

    flow = create_google_flow()


    # IMPORTANT:
    # Restore the exact verifier generated
    # during /login.

    flow.code_verifier = code_verifier


    # -----------------------------------------------------
    # 4. Exchange authorization code for tokens
    # -----------------------------------------------------

    flow.fetch_token(
        code=code,
    )


    credentials = flow.credentials


    # -----------------------------------------------------
    # 5. Make sure we received refresh token
    # -----------------------------------------------------

    refresh_token = credentials.refresh_token


    if not refresh_token:

        return {
            "success": False,
            "error": (
                "Google did not return a refresh token. "
                "Please authorize again."
            ),
        }


    # -----------------------------------------------------
    # 6. Get Google user's email
    # -----------------------------------------------------

    userinfo_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={
            "Authorization": (
                f"Bearer {credentials.token}"
            )
        },
        timeout=10,
    )


    if userinfo_response.status_code != 200:

        return {
            "success": False,
            "error": (
                "Could not fetch Google user information."
            ),
        }


    google_user = (
        userinfo_response.json()
    )


    google_email = google_user.get(
        "email"
    )


    if not google_email:

        return {
            "success": False,
            "error": (
                "Google email could not be retrieved."
            ),
        }


    # -----------------------------------------------------
    # 7. Check if doctor already connected Google
    # -----------------------------------------------------

    existing_account = get_by_doctor(
        db,
        doctor_id,
    )


    # -----------------------------------------------------
    # 8. Update existing Google account
    # -----------------------------------------------------

    if existing_account:

        existing_account.google_email = (
            google_email
        )

        existing_account.refresh_token = (
            refresh_token
        )

        existing_account.calendar_id = (
            "primary"
        )

        db.commit()

        db.refresh(
            existing_account
        )


    # -----------------------------------------------------
    # 9. Create new Google account
    # -----------------------------------------------------

    else:

        create(
            db=db,

            doctor_id=doctor_id,

            google_email=google_email,

            refresh_token=refresh_token,

            calendar_id="primary",
        )


    # -----------------------------------------------------
    # 10. Clean OAuth session
    # -----------------------------------------------------

    request.session.pop(
        "google_state",
        None,
    )

    request.session.pop(
        "google_code_verifier",
        None,
    )

    request.session.pop(
        "google_doctor_id",
        None,
    )


    # -----------------------------------------------------
    # 11. Success
    # -----------------------------------------------------

    return {
        "success": True,
        "message": (
            "Google connected successfully"
        ),
        "google_email": google_email,
    }