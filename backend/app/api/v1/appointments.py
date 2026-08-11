from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi import HTTPException
from fastapi import status

from app.api.dependencies import DBSession
from app.db.database import get_db

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
)

from app.services.appointment_service import AppointmentService


router = APIRouter()


# ============================================================
# CREATE APPOINTMENT
# ============================================================

@router.post(
    "/",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(
    appointment: AppointmentCreate,
    db: DBSession,
):
    try:
        return AppointmentService.create(
            db,
            appointment,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# UPDATE APPOINTMENT
# ============================================================

@router.put(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
def update_appointment(
    appointment_id: UUID,
    appointment: AppointmentUpdate,
    db: DBSession,
):
    try:
        return AppointmentService.update(
            db,
            appointment_id,
            appointment,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id,
    db: Session = Depends(get_db),
):
    try:
        return AppointmentService.delete(
            db,
            appointment_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

@router.get(
    "/patient/{patient_id}",
    response_model=list[AppointmentResponse],
)
def get_patient_appointments(
    patient_id: UUID,
    db: DBSession,
):
    return AppointmentService.get_by_patient(
        db,
        patient_id,
    )