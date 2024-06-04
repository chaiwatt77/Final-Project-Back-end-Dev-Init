import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateToken = (id: string | number | Types.ObjectId): string => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable is not defined');
  }

  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '3d' });
};

export default generateToken;