from fastapi import FastAPI

from app.api.v1.health import router as health_router
from app.api.v1.doctors import router as doctor_router
from app.api.v1.patients import router as patient_router
from app.api.v1.appointments import router as appointment_router
from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


app.include_router(
    health_router,
    prefix="/api/v1",
    tags=["Health"],
)

app.include_router(
    doctor_router,
    prefix="/api/v1/doctors",
    tags=["Doctors"],
)

app.include_router(
    patient_router,
    prefix="/api/v1/patients",
    tags=["Patients"],
)

app.include_router(
    appointment_router,
    prefix="/api/v1/appointments",
    tags=["Appointments"],
)


@app.get("/")
def root():
    return {
        "message": "Doctor Appointment API",
        "status": "running",
    }