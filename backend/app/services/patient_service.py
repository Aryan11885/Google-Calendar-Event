from uuid import UUID

from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.repositories.patient_repository import PatientRepository
from app.schemas.patient import PatientCreate
from app.schemas.patient import PatientUpdate


class PatientService:

    @staticmethod
    def create_patient(
        db: Session,
        patient: PatientCreate,
    ) -> Patient:

        return PatientRepository.create(
            db,
            patient,
        )

    @staticmethod
    def get_patients(
        db: Session,
    ) -> list[Patient]:

        return PatientRepository.get_all(db)

    @staticmethod
    def get_patient(
        db: Session,
        patient_id: UUID,
    ) -> Patient | None:

        return PatientRepository.get_by_id(
            db,
            patient_id,
        )

    @staticmethod
    def update_patient(
        db: Session,
        patient_id: UUID,
        patient: PatientUpdate,
    ) -> Patient | None:

        db_patient = PatientRepository.get_by_id(
            db,
            patient_id,
        )

        if db_patient is None:
            return None

        return PatientRepository.update(
            db,
            db_patient,
            patient,
        )

    @staticmethod
    def delete_patient(
        db: Session,
        patient_id: UUID,
    ) -> bool:

        db_patient = PatientRepository.get_by_id(
            db,
            patient_id,
        )

        if db_patient is None:
            return False

        PatientRepository.delete(
            db,
            db_patient,
        )

        return True

    @staticmethod
    def get_patient_by_email(
        db: Session,
        email: str,
    ):
        return PatientRepository.get_by_email(
            db,
            email,
        )