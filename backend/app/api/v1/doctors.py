from uuid import UUID

from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status

from app.api.dependencies import DBSession
from app.schemas.doctor import DoctorCreate
from app.schemas.doctor import DoctorResponse
from app.schemas.doctor import DoctorUpdate
from app.services.doctor_service import DoctorService

router = APIRouter()


@router.post(
    "/",
    response_model=DoctorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_doctor(
    doctor: DoctorCreate,
    db: DBSession,
):
    return DoctorService.create_doctor(
        db,
        doctor,
    )


@router.get(
    "/",
    response_model=list[DoctorResponse],
)
def get_doctors(
    db: DBSession,
):
    return DoctorService.get_doctors(db)


@router.get(
    "/{doctor_id}",
    response_model=DoctorResponse,
)
def get_doctor(
    doctor_id: UUID,
    db: DBSession,
):
    doctor = DoctorService.get_doctor(
        db,
        doctor_id,
    )

    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    return doctor


@router.patch(
    "/{doctor_id}",
    response_model=DoctorResponse,
)
def update_doctor(
    doctor_id: UUID,
    doctor: DoctorUpdate,
    db: DBSession,
):
    updated = DoctorService.update_doctor(
        db,
        doctor_id,
        doctor,
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    return updated


@router.delete(
    "/{doctor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_doctor(
    doctor_id: UUID,
    db: DBSession,
):
    deleted = DoctorService.delete_doctor(
        db,
        doctor_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )