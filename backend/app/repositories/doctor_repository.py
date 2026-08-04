from uuid import UUID

from sqlalchemy.orm import Session

from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate
from app.schemas.doctor import DoctorUpdate


class DoctorRepository:

    @staticmethod
    def create(
        db: Session,
        doctor: DoctorCreate,
    ) -> Doctor:

        db_doctor = Doctor(
            **doctor.model_dump(),
        )

        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)

        return db_doctor

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Doctor]:

        return (
            db.query(Doctor)
            .order_by(Doctor.full_name)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        doctor_id: UUID,
    ) -> Doctor | None:

        return (
            db.query(Doctor)
            .filter(Doctor.id == str(doctor_id))
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        db_doctor: Doctor,
        doctor: DoctorUpdate,
    ) -> Doctor:

        update_data = doctor.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(
                db_doctor,
                key,
                value,
            )

        db.commit()
        db.refresh(db_doctor)

        return db_doctor

    @staticmethod
    def delete(
        db: Session,
        db_doctor: Doctor,
    ) -> None:

        db.delete(db_doctor)
        db.commit()