from sqlalchemy.orm import Session

from app.models.doctor_google_account import (
    DoctorGoogleAccount,
)


def get_by_doctor(
    db: Session,
    doctor_id: str,
):

    return (
        db.query(DoctorGoogleAccount)
        .filter(
            DoctorGoogleAccount.doctor_id
            == doctor_id
        )
        .first()
    )


def create(
    db: Session,
    doctor_id: str,
    google_email: str,
    refresh_token: str,
    calendar_id: str = "primary",
):

    account = DoctorGoogleAccount(
        doctor_id=doctor_id,
        google_email=google_email,
        refresh_token=refresh_token,
        calendar_id=calendar_id,
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account