from datetime import date
from datetime import time
from uuid import UUID

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field


class AppointmentCreate(BaseModel):
    doctor_id: UUID
    patient_id: UUID
    appointment_date: date
    start_time: time
    reason: str = Field(..., min_length=5, max_length=500)


class AppointmentResponse(BaseModel):
    id: UUID
    doctor_id: UUID
    patient_id: UUID
    appointment_date: date
    start_time: time
    end_time: time
    status: str

    model_config = ConfigDict(
        from_attributes=True,
    )