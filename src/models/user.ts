import mongoose, { Document, Schema, Model, model } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  created_at: Date;
  last_login?: Date;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date }
});

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
