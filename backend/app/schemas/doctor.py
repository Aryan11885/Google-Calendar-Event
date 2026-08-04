from datetime import time
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class DoctorBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    specialization: str = Field(..., min_length=2, max_length=100)
    working_start: time
    working_end: time
    slot_duration: int = Field(default=30, ge=15, le=120)


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None
    specialization: str | None = Field(default=None, min_length=2, max_length=100)
    working_start: time | None = None
    working_end: time | None = None
    slot_duration: int | None = Field(default=None, ge=15, le=120)
    is_active: bool | None = None


class DoctorResponse(DoctorBase):
    id: UUID
    is_active: bool

    model_config = ConfigDict(from_attributes=True)