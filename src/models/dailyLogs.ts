import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyLog extends Document {
  user_id: mongoose.Types.ObjectId;
  content: string;
  date: Date;
  created_at: Date;
}

const dailyLogSchema: Schema<IDailyLog> = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

const DailyLog: Model<IDailyLog> = mongoose.model<IDailyLog>('DailyLog', dailyLogSchema,'daily_logs');

export default DailyLog;
