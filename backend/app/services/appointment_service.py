from datetime import datetime
from datetime import timedelta

from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.enums import AppointmentStatus
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.doctor_repository import DoctorRepository
from app.repositories.patient_repository import PatientRepository
from app.schemas.appointment import AppointmentCreate


class AppointmentService:

    @staticmethod
    def create(
        db: Session,
        appointment: AppointmentCreate,
    ):

        doctor = DoctorRepository.get_by_id(
            db,
            appointment.doctor_id,
        )

        if doctor is None:
            raise ValueError("Doctor not found")

        patient = PatientRepository.get_by_id(
            db,
            appointment.patient_id,
        )

        if patient is None:
            raise ValueError("Patient not found")

        booked = AppointmentRepository.get_by_doctor_and_date(
            db,
            str(appointment.doctor_id),
            appointment.appointment_date,
        )

        for item in booked:

            if item.start_time == appointment.start_time:
                raise ValueError("Slot already booked")

        end_time = (
            datetime.combine(
                appointment.appointment_date,
                appointment.start_time,
            )
            + timedelta(
                minutes=doctor.slot_duration,
            )
        ).time()

        db_appointment = Appointment(
            doctor_id=str(appointment.doctor_id),
            patient_id=str(appointment.patient_id),
            appointment_date=appointment.appointment_date,
            start_time=appointment.start_time,
            end_time=end_time,
            reason=appointment.reason,
            status=AppointmentStatus.BOOKED,
        )

        return AppointmentRepository.create(
            db,
            db_appointment,
        )