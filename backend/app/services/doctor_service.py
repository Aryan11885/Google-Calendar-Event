from uuid import UUID

from sqlalchemy.orm import Session

from app.models.doctor import Doctor
from app.repositories.doctor_repository import DoctorRepository
from app.schemas.doctor import DoctorCreate
from app.schemas.doctor import DoctorUpdate


class DoctorService:

    @staticmethod
    def create_doctor(
        db: Session,
        doctor: DoctorCreate,
    ) -> Doctor:

        return DoctorRepository.create(
            db,
            doctor,
        )

    @staticmethod
    def get_doctors(
        db: Session,
    ) -> list[Doctor]:

        return DoctorRepository.get_all(db)

    @staticmethod
    def get_doctor(
        db: Session,
        doctor_id: UUID,
    ) -> Doctor | None:

        return DoctorRepository.get_by_id(
            db,
            doctor_id,
        )

    @staticmethod
    def update_doctor(
        db: Session,
        doctor_id: UUID,
        doctor: DoctorUpdate,
    ) -> Doctor | None:

        db_doctor = DoctorRepository.get_by_id(
            db,
            doctor_id,
        )

        if db_doctor is None:
            return None

        return DoctorRepository.update(
            db,
            db_doctor,
            doctor,
        )

    @staticmethod
    def delete_doctor(
        db: Session,
        doctor_id: UUID,
    ) -> bool:

        db_doctor = DoctorRepository.get_by_id(
            db,
            doctor_id,
        )

        if db_doctor is None:
            return False

        DoctorRepository.delete(
            db,
            db_doctor,
        )

        return True