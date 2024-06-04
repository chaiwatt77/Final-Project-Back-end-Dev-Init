import { Router } from "express";
import { loginUserCtrl, registerUserCtrl } from "../controllers/userController";

const userRouter = Router();

userRouter.post('/register', registerUserCtrl);
userRouter.post('/login', loginUserCtrl)


export default userRouter;
