import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGoogleCalendar } from "@/lib/google";
import {
  createCalendarEvent,
  getUpcomingEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/services/calendar.service";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const calendar = getGoogleCalendar(session.accessToken);

    const event = {
      summary: body.summary,
      description: body.description,
      location: body.location,

      start: {
        dateTime: new Date(body.start).toISOString(),
        timeZone: "Asia/Kolkata",
      },

      end: {
        dateTime: new Date(body.end).toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };

    const createdEvent = await createCalendarEvent(calendar, event);

    return NextResponse.json(createdEvent);
  } catch (error: any) {
    console.dir(error.response?.data, { depth: null });

    return NextResponse.json(
      {
        message: "Failed to create event",
        error: error.response?.data,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const calendar = getGoogleCalendar(session.accessToken);

    const events = await getUpcomingEvents(calendar);

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const calendar = getGoogleCalendar(session.accessToken);

    const updatedEvent = {
      summary: body.summary,
      description: body.description,
      location: body.location,

      start: {
        dateTime: new Date(body.start).toISOString(),
        timeZone: "Asia/Kolkata",
      },

      end: {
        dateTime: new Date(body.end).toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };

    const event = await updateCalendarEvent(
      calendar,
      body.id,
      updatedEvent
    );

    return NextResponse.json(event);
  } catch (error: any) {
    console.dir(error.response?.data, { depth: null });

    return NextResponse.json(
      {
        message: "Failed to update event",
        error: error.response?.data,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const calendar = getGoogleCalendar(session.accessToken);

  await deleteCalendarEvent(calendar, body.id);

  return Response.json({
    message: "Event deleted successfully",
  });
}