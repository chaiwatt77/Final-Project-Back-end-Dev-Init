import dotenv from "dotenv";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import generateToken from "../utils/generateToken";
import express, { Application, Request, Response, NextFunction } from 'express';
import DailyLog from "../models/dailyLogs";
import logRouter from "../routes/logRoute";

dotenv.config();

let app: Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use("/api/test", logRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Log Routes", () => {
  const authToken = generateToken("66568f1df1f9b2457ae8b3a0");
  const invalidToken = "invalid-token-123";

  describe("Get all logs for a user", () => {
    it("should return all logs for user", async () => {
      const log1 = {
        user_id:"66568f1df1f9b2457ae8b3a0",
        content:"test content",
        date:"2024-05-29"
      }
      const log2 = {
        user_id:"66568f1df1f9b2457ae8b3a7",
        content:"test content",
        date:"2024-05-29"
      }

      await DailyLog.create(log1);
      await DailyLog.create(log2);

      const response = await request(app).get("/api/test").set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Retrieve all logs for the user");
      console.log(response.body)
      expect(response.body.logs).toHaveLength(1);
      expect(response.body.logs[0].user_id).toBe("66568f1df1f9b2457ae8b3a0");
    });
  });

  describe("Add a new log entry", () => {
    it("should create a new log", async () => {
      const logData = {
        user_id: "66568f1df1f9b2457ae8b3a0",
        content: "test content",
        date: "2024-05-29",
      };

      const response = await request(app)
        .post("/api/test")
        .set("Authorization", `Bearer ${authToken}`)
        .send(logData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(
        "New log entry added"
      );

      const savedLog = await DailyLog.findOne({ user_id: "66568f1df1f9b2457ae8b3a0" });
      expect(savedLog).toBeTruthy();
      expect(savedLog!.user_id.toString()).toBe("66568f1df1f9b2457ae8b3a0");
      expect(savedLog!.content).toBe("test content");
    });

    it("should return 401 because token is invalid", async () => {
      const log = {
        user_id:"66568f1df1f9b2457ae8b3a7",
        content:"test content",
        date:"2024-05-29"
      }

      const response = await request(app)
        .post("/api/test")
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(log);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

    it("should return 401 because token is missing", async () => {
      const log = {
        user_id:"66568f1df1f9b2457ae8b3a7",
        content:"test content",
        date:"2024-05-29"
      }

      const response = await request(app)
        .post("/api/test")
        .send(log);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("No Token Found or Invalid Token");
    });
  });

  describe("Update an existing log entry", () => {
    it("should update log details", async () => {
      const existingLog = await DailyLog.create({
        user_id:"66568f1df1f9b2457ae8b3a0",
        content:"test content",
        date:"2024-05-29"
      });
      

      const updatedLog = {
        content:"new content",
        date:"2024-07-29"
      };

      const response = await request(app).put(`/api/test/${existingLog._id}`).set("Authorization", `Bearer ${authToken}`).send(updatedLog);
      console.log(existingLog)
      console.log(`/api/test/${existingLog._id}`)
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Log entry updated successfully");

      const newLog = await DailyLog.findById(existingLog._id);
      expect(newLog!.content).toBe("new content");
    });
  })

  describe("Delete a log entry", () => {
    it("should delete log", async () => {
      const existingLog = await DailyLog.create({
        user_id:"66568f1df1f9b2457ae8b3a0",
        content:"test content",
        date:"2024-05-29"
      });

      const response = await request(app).delete(`/api/test/${existingLog._id}`).set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Log entry deleted successfully");

      const deletedProduct = await DailyLog.findById(existingLog._id);
      expect(deletedProduct).toBeNull();
    });
  });
});
