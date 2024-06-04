import {
  editEvent,
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent
} from "../controllers/eventController";
import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn";

const eventRouter = Router();

eventRouter.get("/", isLoggedIn, getAllEvents);
eventRouter.get("/:id", isLoggedIn, getEventById);
eventRouter.post("/", isLoggedIn, createEvent);
eventRouter.put("/:id", isLoggedIn, editEvent);
eventRouter.delete("/:id", isLoggedIn, deleteEvent);

export default eventRouter;
