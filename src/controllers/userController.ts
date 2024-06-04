import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import User from '../models/user';
import mongoose, { Document } from 'mongoose';

interface RegisterUserRequest extends Request {
  body: {
    email: string;
    password: string;
    username: string;
  };
}

export const registerUserCtrl = async (req: RegisterUserRequest, res: Response): Promise<void> => {
  const { email, password, username } = req.body;
  try {
    const userExists = await User.findOne({
      $or: [{ email }, { "personal_info.username": username }],
    });

    if (userExists) {
      res.status(400).json({
        msg: "Error due to existing username",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    res.status(201).json({
      status: "success",
      message: "User is registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

interface IUser extends Document {
  username: string;
  password: string;
  _id: mongoose.Types.ObjectId;
  last_login: Date;
}

interface LoginUserRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

export const loginUserCtrl = async (req: LoginUserRequest, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const userFound: IUser | null = await User.findOne({ username });
    if (userFound && await bcrypt.compare(password, userFound.password)) {
      userFound.last_login = new Date();
      await userFound.save();

      const token = generateToken(userFound._id);
      
      res.status(200).json({
        status: "success",
        message: "Login successful",
        userFound,
        token
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Error due to incorrect credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
