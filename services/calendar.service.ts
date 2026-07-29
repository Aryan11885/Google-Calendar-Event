import { calendar_v3 } from "googleapis";

export async function createCalendarEvent(
  calendar: calendar_v3.Calendar,
  event: calendar_v3.Schema$Event
) {
  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return response.data;
}