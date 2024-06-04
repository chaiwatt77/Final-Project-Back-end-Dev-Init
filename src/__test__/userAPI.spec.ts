import dotenv from "dotenv"
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express, { Application } from 'express';
import User from "../models/user";
import userRouter from "../routes/userRoute";
import bcrypt from "bcryptjs";

dotenv.config();

let app: Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use('/api/test', userRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Routes", () => {
  describe("Register new user with valid data", () => {
    it("should register new user", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        username: "testuser",
      };

      const response = await request(app).post("/api/test/register").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("User is registered successfully");

      const user = await User.findOne({ email: "test@example.com" });
      expect(user).toBeTruthy();
      if (user) {
        expect(user.username).toBe('testuser');
      }
    });

    it("Register new user with existing username", async () => {
      await User.create({
        email: "existing@example.com",
        password: await bcrypt.hash("password123", 10),
        username: "existinguser",
      });

      const userData = {
        email: "existing@example.com",
        password: "password123",
        username: "newuser",
      };

      const response = await request(app).post("/api/test/register").send(userData);

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Error due to existing username");
    });
  });

  describe("Login with correct credentials", () => {
    it("should login a user", async () => {

      const loginData = {
        email: "test@example.com",
        password: "password123",
        username: "testuser",
      };

      const response = await request(app).post("/api/test/login").send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBeTruthy();
    });

    it("Login with incorrect credentials", async () => {

      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app).post("/api/test/login").send(loginData);

      expect(response.status).toBe(500);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Error due to incorrect credentials");
    });
  });
});