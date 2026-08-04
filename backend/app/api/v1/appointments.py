from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status

from app.api.dependencies import DBSession
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
)
from app.services.appointment_service import AppointmentService

router = APIRouter()


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