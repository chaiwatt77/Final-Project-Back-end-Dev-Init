import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IToDo extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  due_date: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  created_at: Date;
}

const toDoSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  created_at: { type: Date, default: Date.now }
});

const ToDo: Model<IToDo> = mongoose.model<IToDo>('ToDo', toDoSchema);
export default ToDo;
