from datetime import datetime
from datetime import timedelta

from sqlalchemy.orm import Session

from app.repositories.appointment_repository import AppointmentRepository


class SlotService:

    @staticmethod
    def get_available_slots(
        db: Session,
        doctor,
        appointment_date,
    ):

        slots = []

        current = datetime.combine(
            appointment_date,
            doctor.working_start,
        )

        end = datetime.combine(
            appointment_date,
            doctor.working_end,
        )

        booked = AppointmentRepository.get_by_doctor_and_date(
            db,
            doctor.id,
            appointment_date,
        )

        booked_starts = {
            appointment.start_time
            for appointment in booked
        }

        while current < end:

            slot_end = current + timedelta(
                minutes=doctor.slot_duration,
            )

            if current.time() not in booked_starts:

                slots.append(
                    {
                        "start": current.time(),
                        "end": slot_end.time(),
                    }
                )

            current = slot_end

        return slots