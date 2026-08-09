from datetime import datetime

from googleapiclient.discovery import build

from app.core.google import create_credentials


def create_calendar_event(
    refresh_token: str,
    calendar_id: str,
    patient_name: str,
    patient_email: str,
    start: datetime,
    end: datetime,
):

    credentials = create_credentials(
        refresh_token
    )

    service = build(
        "calendar",
        "v3",
        credentials=credentials,
    )

    event = {
        "summary": (
            f"Doctor Appointment - "
            f"{patient_name}"
        ),

        "description": (
            f"Patient: {patient_name}\n"
            f"Email: {patient_email}"
        ),

        "start": {
            "dateTime": start.isoformat(),
            "timeZone": "Asia/Kolkata",
        },

        "end": {
            "dateTime": end.isoformat(),
            "timeZone": "Asia/Kolkata",
        },

        "attendees": [
            {
                "email": patient_email
            }
        ],
    }

    return service.events().insert(
        calendarId=calendar_id,
        body=event,
        sendUpdates="all",
    ).execute()