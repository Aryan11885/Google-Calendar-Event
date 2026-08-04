from uuid import UUID

from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient import PatientCreate
from app.schemas.patient import PatientUpdate


class PatientRepository:

    @staticmethod
    def create(
        db: Session,
        patient: PatientCreate,
    ) -> Patient:

        db_patient = Patient(
            **patient.model_dump(),
        )

        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)

        return db_patient

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Patient]:

        return (
            db.query(Patient)
            .order_by(Patient.full_name)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        patient_id: UUID,
    ) -> Patient | None:

        return (
            db.query(Patient)
            .filter(Patient.id == str(patient_id))
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        db_patient: Patient,
        patient: PatientUpdate,
    ) -> Patient:

        update_data = patient.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(
                db_patient,
                key,
                value,
            )

        db.commit()
        db.refresh(db_patient)

        return db_patient

    @staticmethod
    def delete(
        db: Session,
        db_patient: Patient,
    ) -> None:

        db.delete(db_patient)
        db.commit()