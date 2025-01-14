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

describe("GET /api/conversations", () => {
  it("Should return 401 if no session exists", async () => {
    getServerSession.mockResolvedValue(null);

    const response = await GET();
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

    const response = await GET();
    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "User not found", status: 404 });
  });

  it("Should return 200 with formatted conversations", async () => {
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

    const response = await GET();

    expect(response.status).toBe(200);
  });

  it("Should return 500 if an internal server error occurs", async () => {
    getServerSession.mockImplementation(() => {
      throw new Error("Internal error");
    });

    const response = await GET();
    const responseJson = await response.json();

    expect(responseJson).toEqual({
      error: "Internal server error",
    });
    expect(response.status).toBe(500);
  });
});

describe("POST /api/conversations", () => {
  it("Should return 401 if no session exists", async () => {
    getServerSession.mockResolvedValue(null);

    const response = await GET();
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

    const response = await GET();
    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "User not found", status: 404 });
  });

  it("Should return 404 if participant user is not found", async () => {
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

    prismaMock.user.findUnique.mockRejectedValue(null);

    const mockRequest = new NextRequest(
      "http://localhost:3000/api/conversations",
      {
        method: "POST",
        body: JSON.stringify({
          conversationId: "9f25eeed-76ef-4730-be1b-757f030a3ad3",
          participantUserId: null,
        }),
      }
    );

    const response = await POST(mockRequest);
    const responseJson = await response.json();

    expect(responseJson).toEqual({
      message: "Participant user ID is required",
    });
  });

  it("Should return 201 with the new conversation if successful", async () => {
    const conversationId = uuidv4();

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

    prismaMock.user.findUnique.mockResolvedValue({
      userId: "838f6a49-59b2-4131-8977-7cac4d3af4gg",
      username: "ParticipantUser",
      email: "participant.user@mychat.com",
      name: "Participant",
      profilePicture: "https://avatars.githubusercontent.com/u/88277309?v=4",
      createdAt: new Date(),
    });

    prismaMock.conversation.create.mockResolvedValue({
      id: conversationId,
      createdAt: new Date(),
      lastUpdated: new Date(),
    });
    prismaMock.userConversation.createMany.mockResolvedValue({ count: 2 });

    const mockRequest = new NextRequest(
      "http://localhost:3000/api/conversations",
      {
        method: "POST",
        body: JSON.stringify({
          conversationId: conversationId,
          participantUserId: "838f6a49-59b2-4131-8977-7cac4d3af4gg",
        }),
      }
    );

    const response = await POST(mockRequest);

    expect(response.status).toBe(201);
  });

  it("Should return 500 if an internal server error occurs", async () => {
    getServerSession.mockImplementation(() => {
      throw new Error("Internal error");
    });

    const response = await GET();
    const responseJson = await response.json();

    expect(responseJson).toEqual({
      error: "Internal server error",
    });
    expect(response.status).toBe(500);
  });
});
