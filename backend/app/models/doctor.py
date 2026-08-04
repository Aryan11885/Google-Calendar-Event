from datetime import time

from sqlalchemy import Boolean
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Time
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.mixins import TimestampMixin
from app.models.mixins import UUIDMixin


class Doctor(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "doctors"

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    specialization: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    working_start: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    working_end: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    slot_duration: Mapped[int] = mapped_column(
        Integer,
        default=30,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    appointments = relationship(
        "Appointment",
        back_populates="doctor",
        cascade="all, delete-orphan",
    )