import { Router } from "express";
import {
  createDailyLog,
  deleteDailyLog,
  editDailyLog,
  getAllLogs,
  getLogById,
} from "../controllers/logController";
import { isLoggedIn } from "../middlewares/isLoggedIn";
const logRouter = Router();

logRouter.get("/", isLoggedIn, getAllLogs);
logRouter.get("/:id", isLoggedIn, getLogById);
logRouter.post("/", isLoggedIn, createDailyLog);
logRouter.put("/:id", isLoggedIn, editDailyLog);
logRouter.delete("/:id", isLoggedIn, deleteDailyLog);

export default logRouter;
