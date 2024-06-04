import { Request, Response } from 'express';
import ToDo, { IToDo } from '../models/toDoList';

interface CustomRequest extends Request {
  userAuthId?: string;
}

export const getAllToDos = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userAuthId = req.userAuthId;
    if (!userAuthId) {
      res.status(400).json({
        status: "error",
        message: "User not authenticated",
      });
      return;
    }
    const toDos = await ToDo.find({ user_id: userAuthId });

    res.json({
      status: "success",
      toDos
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

export const getToDoById = async (req: CustomRequest, res: Response): Promise<void> => {
  const todoId = req.params.id;

  try {
    const toDo = await ToDo.findById(todoId);

    if (!toDo || req.userAuthId !== toDo.user_id.toString()) {
      res.status(404).json({
        status: "error",
        message: "ToDo not found"
      });
      return;
    }

    res.json({
      status: "success",
      toDo
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

export const createToDo = async (req: Request, res: Response): Promise<void> => {
  const { user_id, title, description, due_date, priority, status } = req.body;

  try {
    const newToDo: IToDo = new ToDo({
      user_id,
      title,
      description,
      due_date,
      priority,
      status,
      created_at: new Date()
    });

    const savedToDo = await newToDo.save();

    res.status(201).json({
      status: "success",
      message: "New to-do added",
      todo: savedToDo
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

export const editToDo = async (req: CustomRequest, res: Response): Promise<void> => {
  const todoId = req.params.id;
  const { title, description, due_date, priority, status } = req.body;

  try {
    const updatedToDo = await ToDo.findByIdAndUpdate(
      todoId,
      { title, description, due_date, priority, status },
      { new: true, runValidators: true }
    );

    if (!updatedToDo || req.userAuthId !== updatedToDo.user_id.toString()) {
      res.status(404).json({
        status: "error",
        message: "ToDo not found"
      });
      return;
    }

    res.json({
      status: "success",
      message: "To-do status updated",
      todo: updatedToDo
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteToDo = async (req: Request, res: Response): Promise<void> => {
  const todoId = req.params.id;

  try {
    const deletedToDo = await ToDo.findByIdAndDelete(todoId);

    if (!deletedToDo) {
      res.status(404).json({
        status: "error",
        message: "ToDo not found"
      });
      return;
    }

    res.json({
      status: "success",
      message: "To-do deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};