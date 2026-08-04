from datetime import time

from pydantic import BaseModel


class SlotResponse(BaseModel):
    start: time
    end: time