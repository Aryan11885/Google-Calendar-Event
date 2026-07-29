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

export async function getUpcomingEvents(
  calendar: calendar_v3.Calendar
) {
  const response = await calendar.events.list({
    calendarId: "primary",
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
    timeMin: new Date().toISOString(),
  });

  return response.data.items ?? [];
}

export async function updateCalendarEvent(
  calendar: calendar_v3.Calendar,
  eventId: string,
  event: calendar_v3.Schema$Event
) {
  const response = await calendar.events.update({
    calendarId: "primary",
    eventId,
    requestBody: event,
  });

  return response.data;
}