from datetime import datetime
from datetime import timedelta

from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.enums import AppointmentStatus

from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.doctor_repository import DoctorRepository
from app.repositories.patient_repository import PatientRepository

from app.schemas.appointment import AppointmentCreate
from app.repositories.doctor_google_repository import (
    get_by_doctor,
)

from app.services.google_calendar_service import (
    create_calendar_event,
)

class AppointmentService:

    @staticmethod
    def create(
        db: Session,
        appointment: AppointmentCreate,
    ):

        # ----------------------------------------
        # 1. Check doctor
        # ----------------------------------------

        doctor = DoctorRepository.get_by_id(
            db,
            appointment.doctor_id,
        )

        if doctor is None:
            raise ValueError("Doctor not found")

        # ----------------------------------------
        # 2. Check patient
        # ----------------------------------------

        patient = PatientRepository.get_by_id(
            db,
            appointment.patient_id,
        )

        if patient is None:
            raise ValueError("Patient not found")

        # ----------------------------------------
        # 3. Check already booked slots
        # ----------------------------------------

        booked = AppointmentRepository.get_by_doctor_and_date(
            db,
            str(appointment.doctor_id),
            appointment.appointment_date,
        )

        for item in booked:

            if item.start_time == appointment.start_time:
                raise ValueError("Slot already booked")

        # ----------------------------------------
        # 4. Calculate appointment end time
        # ----------------------------------------

        end_time = (
            datetime.combine(
                appointment.appointment_date,
                appointment.start_time,
            )
            + timedelta(
                minutes=doctor.slot_duration,
            )
        ).time()

        # ----------------------------------------
        # 5. Create appointment
        # ----------------------------------------

        db_appointment = Appointment(
            doctor_id=str(appointment.doctor_id),
            patient_id=str(appointment.patient_id),
            appointment_date=appointment.appointment_date,
            start_time=appointment.start_time,
            end_time=end_time,
            reason=appointment.reason,
            status=AppointmentStatus.BOOKED,
        )

        # ----------------------------------------
        # 6. Save appointment to database
        # ----------------------------------------

        created_appointment = AppointmentRepository.create(
            db,
            db_appointment,
        )

        # ----------------------------------------
        # 7. Check if doctor has Google connected
        # ----------------------------------------

        google_account = get_by_doctor(
            db,
            str(appointment.doctor_id),
        )

        # ----------------------------------------
        # 8. Temporary check
        # ----------------------------------------

        if google_account:
        
            print(
                "Google account found:",
                google_account.google_email,
            )
        
            start_datetime = datetime.combine(
                created_appointment.appointment_date,
                created_appointment.start_time,
            )
        
            end_datetime = datetime.combine(
                created_appointment.appointment_date,
                created_appointment.end_time,
            )
        
            google_event = create_calendar_event(
                refresh_token=google_account.refresh_token,
                calendar_id=google_account.calendar_id,
                patient_name=patient.full_name,
                patient_email=patient.email,
                start=start_datetime,
                end=end_datetime,
            )
        
            created_appointment.google_event_id = (
                google_event["id"]
            )
        
            db.commit()
            db.refresh(created_appointment)
        
            print(
                "Google Calendar event created:",
                created_appointment.google_event_id,
            )
        
        else:
        
            print(
                "No Google account connected for this doctor."
            )

        # ----------------------------------------
        # 9. Return created appointment
        # ----------------------------------------

        return created_appointment

    @staticmethod    
    def update(
        db: Session,
        appointment_id,
        appointment_data,
    ):
        # 1. Find existing appointment
        existing_appointment = AppointmentRepository.get_by_id(
            db,
            appointment_id,
        )

        if existing_appointment is None:
            raise ValueError("Appointment not found")

        # 2. Check if the new slot is already booked
        booked = AppointmentRepository.get_by_doctor_and_date(
            db,
            str(existing_appointment.doctor_id),
            appointment_data.appointment_date,
        )

        for item in booked:
            if (
                item.id != existing_appointment.id
                and item.start_time == appointment_data.start_time
            ):
                raise ValueError("Slot already booked")

        # 3. Get doctor
        doctor = DoctorRepository.get_by_id(
            db,
            existing_appointment.doctor_id,
        )

        if doctor is None:
            raise ValueError("Doctor not found")

        # 4. Calculate new end time
        end_time = (
            datetime.combine(
                appointment_data.appointment_date,
                appointment_data.start_time,
            )
            + timedelta(
                minutes=doctor.slot_duration,
            )
        ).time()

        # 5. Update database appointment
        existing_appointment.appointment_date = (
            appointment_data.appointment_date
        )

        existing_appointment.start_time = (
            appointment_data.start_time
        )

        existing_appointment.end_time = end_time

        existing_appointment.reason = (
            appointment_data.reason
        )

        # 6. Save changes
        updated_appointment = AppointmentRepository.update(
            db,
            existing_appointment,
        )

        return updated_appointment