import { Request, Response } from 'express';
import DailyLog, { IDailyLog } from '../models/dailyLogs';

interface CustomRequest extends Request {
  userAuthId?: string;
}

export const getAllLogs = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userAuthId = req.userAuthId;

    if (!userAuthId) {
      res.status(400).json({
        status: "error",
        message: "User not authenticated",
      });
      return;
    }

    const logs = await DailyLog.find({ user_id: userAuthId });

    res.status(201).json({
      status: "success",
      message: "Retrieve all logs for the user",
      logs,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

export const getLogById = async (req: CustomRequest, res: Response): Promise<void> => {
  const logId = req.params.id;

  try {
    const log = await DailyLog.findById(logId);

    if (!log || req.userAuthId !== log.user_id.toString()) {
      res.status(404).json({
        status: "error",
        message: "Log not found"
      });
      return;
    }

    res.json({
      status: "success",
      log
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

export const createDailyLog = async (req: Request, res: Response): Promise<void> => {
  const { user_id, content, date } = req.body;

  try {
    const newDailyLog: IDailyLog = new DailyLog({
      user_id,
      content,
      date,
      created_at: new Date()
    });


    const savedLog = await newDailyLog.save();

    res.status(201).json({
      status: "success",
      message: "New log entry added",
      log: savedLog
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

export const editDailyLog = async (req: CustomRequest, res: Response): Promise<void> => {
  const logId = req.params.id;
  const { content, date } = req.body;

  try {
    const existingLog: IDailyLog | null = await DailyLog.findById(logId);

    if (!existingLog || req.userAuthId !== existingLog.user_id.toString()) {
      res.status(404).json({
        status: "error",
        message: "Daily log not found"
      });
      return;
    }

    existingLog.content = content;
    existingLog.date = date;

    const updatedLog = await existingLog.save();

    res.json({
      status: "success",
      message: "Log entry updated successfully",
      log: updatedLog
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteDailyLog = async (req: Request, res: Response): Promise<void> => {
  const logId = req.params.id;

  try {
    const existingLog: IDailyLog | null = await DailyLog.findById(logId);

    if (!existingLog) {
      res.status(404).json({
        status: "error",
        message: "Daily log not found"
      });
      return;
    }

    await DailyLog.findByIdAndDelete(logId);

    res.json({
      status: "success",
      message: "Log entry deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};