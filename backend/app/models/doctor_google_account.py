import uuid

from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base
from app.models.mixins import TimestampMixin
from app.models.mixins import UUIDMixin


class DoctorGoogleAccount(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "doctor_google_accounts"

    doctor_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("doctors.id"),
        unique=True,
        nullable=False,
    )

    google_email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    refresh_token: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    calendar_id: Mapped[str] = mapped_column(
        String,
        default="primary",
    )