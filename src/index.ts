import express, { Request, Response } from 'express';
import { connectDb } from './db/dbConnect';
import dotenv from "dotenv"
import userRouter from './routes/userRoute';
import logRouter from './routes/logRoute';
import todosRouter from './routes/todosRoute';
import eventRouter from './routes/eventRoute';

dotenv.config();



connectDb()

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/users', userRouter)
app.use('/logs', logRouter)
app.use('/todos', todosRouter)
app.use('/events', eventRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
