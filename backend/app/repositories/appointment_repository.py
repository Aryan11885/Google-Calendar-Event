from datetime import date
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.appointment import Appointment


class AppointmentRepository:

    @staticmethod
    def get_by_doctor_and_date(
        db: Session,
        doctor_id: str,
        appointment_date: date,
    ) -> list[Appointment]:

        return (
            db.query(Appointment)
            .filter(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date == appointment_date,
            )
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        appointment_id: UUID,
    ) -> Appointment | None:

        return (
            db.query(Appointment)
            .filter(
                Appointment.id == str(appointment_id)
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        appointment: Appointment,
    ) -> Appointment:

        db.add(appointment)
        db.commit()
        db.refresh(appointment)

        return appointment

    @staticmethod
    def update(
        db: Session,
        appointment: Appointment,
    ) -> Appointment:

        db.commit()
        db.refresh(appointment)

        return appointment