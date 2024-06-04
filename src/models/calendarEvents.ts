import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICalendarEvent extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
}

const calendarEventSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

const CalendarEvent: Model<ICalendarEvent> = mongoose.model<ICalendarEvent>('CalendarEvent', calendarEventSchema);
export default CalendarEvent;
