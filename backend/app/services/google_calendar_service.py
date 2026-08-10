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

def update_calendar_event(
    refresh_token: str,
    calendar_id: str,
    event_id: str,
    patient_name: str,
    patient_email: str,
    start: datetime,
    end: datetime,
    reason: str | None = None,
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
            f"Email: {patient_email}\n"
            f"Reason: {reason or 'Consultation'}"
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

    return service.events().update(
        calendarId=calendar_id,
        eventId=event_id,
        body=event,
        sendUpdates="all",
    ).execute()

def delete_calendar_event(
    refresh_token: str,
    calendar_id: str,
    event_id: str,
):
    credentials = create_credentials(
        refresh_token
    )

    service = build(
        "calendar",
        "v3",
        credentials=credentials,
    )

    return service.events().delete(
        calendarId=calendar_id,
        eventId=event_id,
        sendUpdates="all",
    ).execute()