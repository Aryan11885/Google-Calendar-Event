from datetime import date
from datetime import time

from sqlalchemy import Date
from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import Time
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.enums import AppointmentStatus
from app.models.mixins import TimestampMixin
from app.models.mixins import UUIDMixin


class Appointment(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "appointments"

    doctor_id: Mapped[str] = mapped_column(
        ForeignKey("doctors.id"),
        nullable=False,
    )

    patient_id: Mapped[str] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
    )

    appointment_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus),
        default=AppointmentStatus.BOOKED,
    )

    google_event_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    doctor = relationship(
        "Doctor",
        back_populates="appointments",
    )
    
    patient = relationship(
        "Patient",
        back_populates="appointments",
    )