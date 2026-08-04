from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.mixins import TimestampMixin
from app.models.mixins import UUIDMixin


class Patient(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "patients"

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    appointments = relationship(
       "Appointment",
       back_populates="patient",
       cascade="all, delete-orphan",
    )