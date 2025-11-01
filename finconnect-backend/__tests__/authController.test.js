jest.mock("../models/User", () => require("../__mocks__/models").User);
jest.mock("../models/Subscription", () => require("../__mocks__/models").Subscription);
jest.mock("../models/Transaction", () => require("../__mocks__/models").Transaction);
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const { User } = require("../__mocks__/models");

const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Create a separate test app to avoid database connections
const express = require("express");
const testApp = express();
testApp.use(express.json());

// Mock your routes
const authRoutes = require("../routes/authRoutes");
testApp.use("/api/auth", authRoutes);

describe("Auth Controller", () => {
    let server;

    // Start test server
    beforeAll((done) => {
        server = testApp.listen(0, done);  // 0 = random available port
    });

    // Close test server
    afterAll((done) => { 
        server.close(done);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ------------------- REGISTER -------------------
    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const mockUser = { accountNumber: "12345", name: "Ramiz", email: "ramiz@example.com" };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue(mockUser);

            const response = await request(testApp)  // ✅ Use testApp
                .post("/api/auth/register")
                .send({ name: "Ramiz", email: "ramiz@example.com", password: "123456" });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Registration successful");
            expect(response.body.userId).toBe("12345");
        });

        it("should return error if email already registered", async () => {
            User.findOne.mockResolvedValue({ id: 1, email: "ramiz@example.com" });

            const response = await request(testApp)  // ✅ Use testApp
                .post("/api/auth/register")
                .send({ name: "Ramiz", email: "ramiz@example.com", password: "123456" });

            expect(response.status).toBe(400);
        });
    });

    // ------------------- LOGIN -------------------
    describe("POST /api/auth/login", () => {
        it("should login successfully and return token", async () => {
            const mockUser = {
                accountNumber: "12345",
                name: "Ramiz",
                email: "ramiz@example.com",
                role: "user",
                password: "hashedpass",
                isSubscribed: true,
                apiKey: "key",
                customerId: "cus_123",
                stripeSubId: "sub_123",
                Subscription: {
                    subscriptionId: "sub123",
                    name: "Pro Plan",
                    price: 20,
                    description: "Premium",
                    transactionLimit: 1000,
                    transactionPerDay: 100,
                    invoice: "inv_123",
                    priority: "high",
                    price_id: "price_123",
                },
                toJSON() {
                    return this;
                },
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("fake-jwt-token");

            const response = await request(testApp)  // ✅ Use testApp
                .post("/api/auth/login")
                .send({ email: "ramiz@example.com", password: "123456" });

            expect(response.status).toBe(200);
            expect(response.body.token).toBe("fake-jwt-token");
        });

        it("should return error for invalid email", async () => {
            User.findOne.mockResolvedValue(null);

            const response = await request(testApp)  // ✅ Use testApp
                .post("/api/auth/login")
                .send({ email: "wrong@example.com", password: "123456" });

            expect(response.status).toBe(400);
        });

        it("should return error for invalid password", async () => {
            const mockUser = {
                password: "hashedpass",
                toJSON() {
                    return this;
                },
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const response = await request(testApp)  // ✅ Use testApp
                .post("/api/auth/login")
                .send({ email: "ramiz@example.com", password: "wrongpass" });

            expect(response.status).toBe(400);
        });
    });
});