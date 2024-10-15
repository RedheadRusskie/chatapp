import { vi } from "vitest";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prismaMock from "@/utils/prisma/__mocks__/prisma";
import { GET, POST } from "./route";

const { getServerSession, getCurrentUserByEmail } = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  getCurrentUserByEmail: vi.fn(),
}));

vi.mock("next-auth", () => ({
  getServerSession: getServerSession,
}));

vi.mock("@/lib/shared/queries/user", () => ({
  getCurrentUserByEmail: getCurrentUserByEmail,
}));

const conversationId = "efb73b13-dea5-4ba2-b004-8084092da1c4";

describe("GET /api/messages", () => {
  it("Should return 401 if no session exists", async () => {
    getServerSession.mockResolvedValue(null);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/messages?conversationId=${conversationId}`
    );

    const response = await GET(mockRequest, {
      params: { conversationId },
    });

    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "Forbidden", status: 401 });
  });

  it("Should return 404 if user is not found", async () => {
    getServerSession.mockResolvedValue({
      user: {
        name: "DNE",
        email: "DNE@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    getCurrentUserByEmail.mockResolvedValue(null);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/messages?conversationId=${conversationId}`
    );

    const response = await GET(mockRequest, {
      params: { conversationId },
    });

    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "User not found", status: 404 });
  });

  it("Should return 200 with formatted messages", async () => {
    getServerSession.mockResolvedValue({
      user: {
        name: "TestUser",
        email: "test.user@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    getCurrentUserByEmail.mockResolvedValue({
      userId: "738f6a49-59b2-4131-8977-7cac4d3af4aa",
      username: "TestUser",
      email: "test.user@mychat.com",
      name: "Test",
      profilePicture: "https://avatars.githubusercontent.com/u/88277309?v=4",
      createdAt: new Date(),
    });

    const requestData = {
      id: "0fbdab5e-c10d-4c32-8c9a-7a665d7157a3",
      content: "VQNQUYScdXKBEUAAztODfNr+rA4S5uBztDQp4iORq3dq02h+suCz",
      createdAt: new Date(),
      updatedAt: new Date(),
      senderId: "738f6a49-59b2-4131-8977-7cac4d3af4aa",
    };

    prismaMock.directMessage.findMany.mockResolvedValue([
      {
        conversationId,
        id: requestData.id,
        content: requestData.content,
        createdAt: requestData.createdAt,
        updatedAt: requestData.updatedAt,
        senderId: requestData.senderId,
      },
    ]);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/messages?conversationId=${conversationId}`
    );

    const response = await GET(mockRequest, {
      params: { conversationId },
    });

    expect(response.status).toBe(200);
  });

  it("Should return 500 if an internal server error occurs", async () => {
    getServerSession.mockImplementation(() => {
      throw new Error("Internal error");
    });

    const mockRequest = new NextRequest(
      "http://localhost:3000/api/messages?conversationId=test"
    );

    const response = await GET(mockRequest, {
      params: { conversationId },
    });

    expect(response.status).toBe(500);
  });
});

describe("POST /api/messages", () => {
  it("Should return 401 if no session exists", async () => {
    getServerSession.mockResolvedValue(null);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/messages?conversationId=${conversationId}`,
      {
        method: "POST",
        body: JSON.stringify({
          id: "DNE",
          content: "Does-not-exist",
        }),
      }
    );

    const response = await POST(mockRequest, {
      params: { conversationId },
    });

    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "Forbidden", status: 401 });
  });

  it("Should return 404 if user is not found", async () => {
    getServerSession.mockResolvedValue({
      user: {
        name: "DNE",
        email: "DNE@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    getCurrentUserByEmail.mockResolvedValue(null);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/messages?conversationId=${conversationId}`,
      {
        method: "POST",
        body: JSON.stringify({
          id: "DNE",
          content: "Does-not-exist",
        }),
      }
    );

    const response = await POST(mockRequest, {
      params: { conversationId },
    });

    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "User not found", status: 404 });
  });

  it("Should return 201 with the created message", async () => {
    const newMessageId = uuidv4();

    getServerSession.mockResolvedValue({
      user: {
        name: "TestUser",
        email: "test.user@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    getCurrentUserByEmail.mockResolvedValue({
      userId: "738f6a49-59b2-4131-8977-7cac4d3af4ff",
      username: "TestUser",
      email: "test.user@mychat.com",
      name: "Test",
      profilePicture: "https://avatars.githubusercontent.com/u/88277309?v=4",
      createdAt: new Date(),
    });

    const requestBody = {
      id: newMessageId,
      // Encrypted
      content: "VQNQUYScdXKBEUAAztODfNr+rA4S5uBztDQp4iORq3dq02h+suCz",
    };

    prismaMock.directMessage.create.mockResolvedValue({
      conversationId,
      id: requestBody.id,
      content: requestBody.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      senderId: "738f6a49-59b2-4131-8977-7cac4d3af4ff",
    });

    prismaMock.conversation.update.mockResolvedValue({
      id: conversationId,
      lastUpdated: new Date(),
      createdAt: new Date("2024-10-15 20:58:34.246"),
    });

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/messages?conversationId=${conversationId}`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );

    const response = await POST(mockRequest, {
      params: { conversationId },
    });

    expect(response.status).toBe(201);
  });

  it("Should return 500 if an internal server error occurs", async () => {
    getServerSession.mockImplementation(() => {
      throw new Error("Internal error");
    });

    const requestBody = {
      id: "08d575e6-941c-4e6b-91ae-62fecc45b795",
      // Encrypted
      content: "VQNQUYScdXKBEUAAztODfNr+rA4S5uBztDQp4iORq3dq02h+suCz",
    };

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/messages?conversationId=${conversationId}`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );

    const response = await POST(mockRequest, {
      params: { conversationId },
    });

    const responseJson = await response.json();

    expect(response.status).toBe(500);
    expect(responseJson).toHaveProperty("error");
  });
});
