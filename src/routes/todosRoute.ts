import { Router } from "express";
import { createToDo, deleteToDo, editToDo, getAllToDos, getToDoById } from "../controllers/todosController";
import { isLoggedIn } from "../middlewares/isLoggedIn";

const todosRouter = Router();

todosRouter.get('/', isLoggedIn, getAllToDos);
todosRouter.get('/:id', isLoggedIn, getToDoById);
todosRouter.post('/', isLoggedIn, createToDo);
todosRouter.put('/:id', isLoggedIn, editToDo);
todosRouter.delete('/:id', isLoggedIn, deleteToDo);

export default todosRouter;
