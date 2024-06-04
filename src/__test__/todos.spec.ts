import dotenv from "dotenv";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import generateToken from "../utils/generateToken";
import express, { Application } from 'express';
import ToDo from "../models/toDoList";
import todosRouter from "../routes/todosRoute";

dotenv.config();

let app: Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use("/api/test", todosRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Todo Routes", () => {
  const authToken = generateToken("66568f1df1f9b2457ae8b3a0");
  const invalidToken = "invalid-token-123";

  describe("Add a new to-do", () => {
    it("should create a new todo", async () => {
      const todoData = {
        user_id:"66568f1df1f9b2457ae8b3a0",
        title:"test title",
        description:"as4das54f65a4654",
        due_date:"2024-05-29",
        priority:"High",
        status:"Pending"
      }

      const response = await request(app)
        .post("/api/test")
        .set("Authorization", `Bearer ${authToken}`)
        .send(todoData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(
        "New to-do added"
      );

      const savedTodo = await ToDo.findOne({ user_id: "66568f1df1f9b2457ae8b3a0" });
      expect(savedTodo).toBeTruthy();
      expect(savedTodo!.user_id.toString()).toBe("66568f1df1f9b2457ae8b3a0");
      expect(savedTodo!.title).toBe("test title");
    });

  describe("Update a to-do status", () => {
    it("should update todo details", async () => {
      const existingToDo = await ToDo.create({
        user_id:"66568f1df1f9b2457ae8b3a0",
        title:"test title",
        description:"as4das54f65a4654",
        due_date:"2024-05-29",
        priority:"High",
        status:"Pending"
      });
      

      const updatedTodo = {
        title:"new title",
        description:"new des",
        due_date:"2024-05-30",
        priority:"Low",
        status:"Completed"
      };

      const response = await request(app).put(`/api/test/${existingToDo._id}`).set("Authorization", `Bearer ${authToken}`).send(updatedTodo);

      console.log(`/api/test/${existingToDo._id}`)
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("To-do status updated");

      const newLog = await ToDo.findById(existingToDo._id);
      expect(newLog!.title).toBe("new title");
    });
  })

  describe("Delete a to-do", () => {
    it("should delete to-do", async () => {
      const existingTOdo = await ToDo.create({
        user_id:"66568f1df1f9b2457ae8b3a0",
        title:"test title",
        description:"as4das54f65a4654",
        due_date:"2024-05-29",
        priority:"High",
        status:"Pending"
      });

      const response = await request(app).delete(`/api/test/${existingTOdo._id}`).set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("To-do deleted successfully");

      const deletedToDo = await ToDo.findById(existingTOdo._id);
      expect(deletedToDo).toBeNull();
    });
  });
  });
});
