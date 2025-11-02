const request = require("supertest");
const express = require("express");

// Mock everything at the top
jest.mock("../models/User", () => require("../__mocks__/models").User);
jest.mock("../models/Limit", () => require("../__mocks__/models").Limit);
jest.mock("../models/Transaction", () => require("../__mocks__/models").Transaction);
jest.mock("../models/Subscription", () => require("../__mocks__/models").Subscription);
jest.mock("../config/db", () => ({
    sequelize: {
        query: jest.fn(),
        QueryTypes: {
            SELECT: 'SELECT'
        }
    }
}));

// Mock middlewares
jest.mock("../middlewares/keyCheck", () => (req, res, next) => {
    req.user = {
        accountNumber: "12345",
        balance: 1000,
        apiKey: "test-api-key",
        subscriptionId: "sub_123",
        save: jest.fn().mockResolvedValue(true),
    };
    next();
});

jest.mock("../middlewares/checkSubscriptionLimit", () => (req, res, next) => {
    next();
});

const { User, Limit, Transaction } = require("../__mocks__/models");
const { sequelize } = require("../config/db");

// Create a separate test app to avoid database connections
const testApp = express();
testApp.use(express.json());

// Mock your routes
const fintechRoutes = require("../routes/fintechRoutes");
testApp.use("/api/fintech", fintechRoutes);

describe("Fintech Controller", () => {
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

    // ------------------- GET BALANCE -------------------
    describe("GET /api/fintech/balance", () => {
        it("should return user balance successfully", async () => {
            const mockUser = { accountNumber: "12345", balance: 1000 };

            User.findOne.mockResolvedValue(mockUser);

            const response = await request(testApp)
                .get("/api/fintech/balance")
                .set("x-api-key", "test-api-key");

            expect(response.status).toBe(200);
            expect(response.body.balance).toBe(1000);
        });

        it("should return error if user not found", async () => {
            User.findOne.mockResolvedValue(null);

            const response = await request(testApp)
                .get("/api/fintech/balance")
                .set("x-api-key", "test-api-key");

            expect(response.status).toBe(404);
        });
    });

    // ------------------- TRANSFER FUNDS -------------------
    describe("POST /api/fintech/transfer", () => {
        it("should transfer funds successfully", async () => {
            const mockRecipient = {
                accountNumber: "67890",
                balance: 500,
                subscriptionId: "sub_456",
                save: jest.fn().mockResolvedValue(true),
            };

            User.findOne.mockResolvedValue(mockRecipient);
            Limit.findOne.mockResolvedValue({
                transactionAmount: 0,
                noOfTransactions: 0,
                save: jest.fn().mockResolvedValue(true),
            });
            Transaction.create.mockResolvedValue({});

            const response = await request(testApp)
                .post("/api/fintech/transfer")
                .set("x-api-key", "test-api-key")
                .send({ accountNumber: "67890", amount: 100 });

            expect(response.status).toBe(200);
        });


        it("should return error for insufficient funds", async () => {
            User.findOne.mockResolvedValue({
                accountNumber: "12345",
                balance: 50,
                apiKey: "test-key"
            });

            const response = await request(testApp)
                .post("/api/fintech/transfer")
                .set("x-api-key", "test-api-key")
                .send({ accountNumber: "67890", amount: 100 });

            expect(response.status).toBe(400);
        });

        it("should return error if recipient not found", async () => {
            User.findOne.mockResolvedValue(null); // recipient not found

            const response = await request(testApp)
                .post("/api/fintech/transfer")
                .set("x-api-key", "test-api-key")
                .send({ accountNumber: "67890", amount: 100 });

            expect(response.status).toBe(404);
        });

        it("should return error for self-transfer", async () => {
            // Return the same user to simulate sending to self
            User.findOne.mockResolvedValue({
                accountNumber: "12345",
                balance: 1000,
                apiKey: "test-api-key",
                subscriptionId: "sub_123"
            });

            const response = await request(testApp)
                .post("/api/fintech/transfer")
                .set("x-api-key", "test-api-key")
                .send({ accountNumber: "12345", amount: 100 });

            expect(response.status).toBe(400);
        });
    });

    // ------------------- GET TRANSACTION HISTORY -------------------
    describe("GET /api/fintech/transactions", () => {
        it("should return transaction history successfully", async () => {
            const mockTransactions = {
                count: 2,
                rows: [
                    {
                        transactionId: 1,
                        senderAccount: "12345",
                        receiverAccount: "67890",
                        amount: 100,
                        status: "completed"
                    }
                ]
            };

            Transaction.findAndCountAll.mockResolvedValue(mockTransactions);

            const response = await request(testApp)
                .get("/api/fintech/transactions")
                .set("x-api-key", "test-api-key")
                .query({ page: 1, pageLimit: 5 });

            expect(response.status).toBe(200);
            expect(response.body.transactions).toEqual(mockTransactions);
        });

        it("should use default pagination when no query params provided", async () => {
            Transaction.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

            const response = await request(testApp)
                .get("/api/fintech/transactions")
                .set("x-api-key", "test-api-key");

            expect(response.status).toBe(200);
        });
    });

    // ------------------- GET INVOICE HISTORY -------------------
    describe("GET /api/fintech/invoice", () => {
        it("should return invoice history with date range", async () => {
            const mockInvoices = [
                { transactionId: 1, senderAccount: "12345", receiverAccount: "67890", amount: 100, createdAt: "2024-01-01", status: "completed" },
                { transactionId: 2, senderAccount: "67890", receiverAccount: "12345", amount: 50, createdAt: "2024-01-02", status: "completed" }
            ];

            sequelize.query.mockResolvedValue(mockInvoices);

            const response = await request(testApp)
                .get("/api/fintech/invoice")
                .set("x-api-key", "test-api-key")
                .query({
                    start: "2024-01-01",
                    end: "2024-01-31"
                });

            expect(response.status).toBe(200);
            expect(response.body.totalAmount).toBe(150);
            expect(response.body.totalTransactions).toBe(2);
        });

        it("should calculate totals correctly for multiple transactions", async () => {
            const mockInvoices = [
                { amount: 100 },
                { amount: 200 },
                { amount: 300 }
            ];

            sequelize.query.mockResolvedValue(mockInvoices);

            const response = await request(testApp)
                .get("/api/fintech/invoice")
                .set("x-api-key", "test-api-key")
                .query({ start: "2024-01-01", end: "2024-01-31" });

            expect(response.body.totalAmount).toBe(600);
            expect(response.body.totalTransactions).toBe(3);
        });
    });
});