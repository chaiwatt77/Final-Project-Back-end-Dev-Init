import CalendarEvent, { ICalendarEvent } from "./../models/calendarEvents";
import { Request, Response } from "express";

interface CustomRequest extends Request {
  userAuthId?: string;
}

export const getAllEvents = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const allEvents = await CalendarEvent.find({ user_id: req.userAuthId });

    res.json({
      status: "success",
      allEvents,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id, title, description, start_date, end_date } = req.body;
  try {
    const newCalendarEvent: ICalendarEvent = new CalendarEvent({
      user_id,
      title,
      description,
      start_date,
      end_date,
      created_at: new Date(),
    });

    const savedLog = await newCalendarEvent.save();

    res.status(201).json({
      status: "success",
      message: "Add a new calendar event",
      log: savedLog,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const eventId = req.params.id;
  try {
    const event = await CalendarEvent.findById(eventId)

    res.json({
      status: "success",
      event,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

export const editEvent = async (req: Request, res: Response): Promise<void> => {
  const eventId = req.params.id;
  const { title, description, start_date, end_date } = req.body;

  try {
    const existingEvent: ICalendarEvent | null = await CalendarEvent.findById(eventId);

    if (!existingEvent) {
      res.status(404).json({
        status: "error",
        message: "Daily log not found"
      });
      return;
    }

    existingEvent.title = title;
    existingEvent.description = description;
    existingEvent.start_date = start_date;
    existingEvent.end_date = end_date;

    const updatedEvent = await existingEvent.save();

    res.json({
      status: "success",
      message: "Calendar event updated",
      log: updatedEvent
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const eventId = req.params.id;

  const existingEvent: ICalendarEvent | null = await CalendarEvent.findById(eventId);

  if (!existingEvent) {
    res.status(404).json({
      status: "error",
      message: "Event log not found"
    });
    return;
  }

  try {
    const deletedEvent = await CalendarEvent.findByIdAndDelete(eventId);

    res.json({
      status: "success",
      message: "Delete a calendar event",
      event: deletedEvent
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};