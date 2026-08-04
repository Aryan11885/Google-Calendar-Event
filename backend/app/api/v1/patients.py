from uuid import UUID

from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status

from app.api.dependencies import DBSession
from app.schemas.patient import (
    PatientCreate,
    PatientResponse,
    PatientUpdate,
)
from app.services.patient_service import PatientService

router = APIRouter()


@router.post(
    "/",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_patient(
    patient: PatientCreate,
    db: DBSession,
):
    return PatientService.create_patient(
        db,
        patient,
    )


@router.get(
    "/",
    response_model=list[PatientResponse],
)
def get_patients(
    db: DBSession,
):
    return PatientService.get_patients(db)


@router.get(
    "/{patient_id}",
    response_model=PatientResponse,
)
def get_patient(
    patient_id: UUID,
    db: DBSession,
):
    patient = PatientService.get_patient(
        db,
        patient_id,
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return patient


@router.patch(
    "/{patient_id}",
    response_model=PatientResponse,
)
def update_patient(
    patient_id: UUID,
    patient: PatientUpdate,
    db: DBSession,
):
    updated = PatientService.update_patient(
        db,
        patient_id,
        patient,
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return updated


@router.delete(
    "/{patient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_patient(
    patient_id: UUID,
    db: DBSession,
):
    deleted = PatientService.delete_patient(
        db,
        patient_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )