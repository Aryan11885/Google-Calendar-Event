from datetime import date
from datetime import time
from uuid import UUID

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field


# ============================================================
# CREATE
# ============================================================

class AppointmentCreate(BaseModel):
    doctor_id: UUID
    patient_id: UUID
    appointment_date: date
    start_time: time
    reason: str = Field(
        ...,
        min_length=5,
        max_length=500,
    )


# ============================================================
# UPDATE
# ============================================================

class AppointmentUpdate(BaseModel):
    appointment_date: date
    start_time: time
    reason: str = Field(
        ...,
        min_length=5,
        max_length=500,
    )


# ============================================================
# BASIC APPOINTMENT RESPONSE
# ============================================================

class AppointmentResponse(BaseModel):
    id: UUID
    doctor_id: UUID
    patient_id: UUID
    appointment_date: date
    start_time: time
    end_time: time
    reason: str
    status: str
    google_event_id: str | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# DOCTOR INFO FOR PATIENT APPOINTMENT
# ============================================================

class AppointmentDoctorResponse(BaseModel):
    id: UUID
    full_name: str
    specialization: str

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# PATIENT APPOINTMENT RESPONSE
# ============================================================

class PatientAppointmentResponse(BaseModel):
    id: UUID

    appointment_date: date
    start_time: time
    end_time: time

    reason: str
    status: str

    google_event_id: str | None = None

    doctor: AppointmentDoctorResponse