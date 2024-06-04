import dotenv from "dotenv";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import generateToken from "../utils/generateToken";
import express, { Application, Request, Response, NextFunction } from 'express';
import eventRouter from "../routes/eventRoute";
import CalendarEvent from "../models/calendarEvents";

dotenv.config();

let app: Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use("/api/test", eventRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Event Routes", () => {
  const authToken = generateToken("66568f1df1f9b2457ae8b3a0");
  const invalidToken = "invalid-token-123";

  describe("Add a new calendar event", () => {
    it("should create a new product", async () => {
      const eventData = {
        user_id:"66568f1df1f9b2457ae8b3a0",
        title:"event title",
        description:"test des",
        start_date:"2024-05-19",
        end_date:"2024-05-19"
      }

      const response = await request(app)
        .post("/api/test")
        .set("Authorization", `Bearer ${authToken}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(
        "Add a new calendar event"
      );

      const savedEvent = await CalendarEvent.findOne({ user_id: "66568f1df1f9b2457ae8b3a0" });
      expect(savedEvent).toBeTruthy();
      savedEvent?expect(savedEvent!.user_id.toString()).toBe("66568f1df1f9b2457ae8b3a0"):null;
      expect(savedEvent!.title).toBe("event title");
    });

  describe("Update a calendar event", () => {
    it("should update product details", async () => {
      const existingEvent = await CalendarEvent.create({
        user_id:"66568f1df1f9b2457ae8b3a0",
        title:"event title",
        description:"test des",
        start_date:"2024-05-19",
        end_date:"2024-05-19"
      });
      

      const updatedEvent = {
        title:"new event title",
        description:"new test des",
        start_date:"2024-05-20",
        end_date:"2024-05-21"
      };

      const response = await request(app).put(`/api/test/${existingEvent._id}`).set("Authorization", `Bearer ${authToken}`).send(updatedEvent);

      console.log(`/api/test/${existingEvent._id}`)
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Calendar event updated");

      const newLog = await CalendarEvent.findById(existingEvent._id);
      expect(newLog!.title).toBe("new event title");
    });
  })

  describe("Delete a calendar event", () => {
    it("should delete product", async () => {
      const existingEvent = await CalendarEvent.create({
        user_id:"66568f1df1f9b2457ae8b3a0",
        title:"event title",
        description:"test des",
        start_date:"2024-05-19",
        end_date:"2024-05-19"
      });

      const response = await request(app).delete(`/api/test/${existingEvent._id}`).set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Delete a calendar event");

      const deletedEvent = await CalendarEvent.findById(existingEvent._id);
      expect(deletedEvent).toBeNull();
    });
  });
  });
});
