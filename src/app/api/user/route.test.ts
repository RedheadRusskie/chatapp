import { vi } from "vitest";
import { NextRequest } from "next/server";
import prismaMock from "@/utils/prisma/__mocks__/prisma";
import { GET, POST } from "./route";

const { getServerSession } = vi.hoisted(() => ({
  getServerSession: vi.fn(),
}));

vi.mock("next-auth", () => ({
  getServerSession: getServerSession,
}));

describe("GET /api/user", () => {
  const query = "john";

  it("Should return 401 if no session exists", async () => {
    getServerSession.mockResolvedValue(null);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/user?query=${query}&skip=0&take=10`
    );

    const response = await GET(mockRequest);
    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "Forbidden" });
    expect(response.status).toBe(401);
  });

  it("Should return 404 if user is not found", async () => {
    getServerSession.mockResolvedValue({
      user: {
        email: "not.found@mychat.com",
        name: "NotFound",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    prismaMock.user.findUnique.mockResolvedValue(null);

    const mockRequest = new NextRequest(`http://localhost:3000/api/user`);

    const response = await GET(mockRequest);
    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "User not found" });
    expect(response.status).toBe(404);
  });

  it("Should return 406 if query parameter is missing or too short", async () => {
    getServerSession.mockResolvedValue({
      user: {
        name: "TestUser",
        email: "test.user@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/user?query=a&skip=0&take=10`
    );

    const responseShort = await GET(mockRequest);

    const responseJsonShort = await responseShort.json();

    expect(responseJsonShort).toEqual({
      message: "Query parameter too short or missing.",
    });
    expect(responseShort.status).toBe(406);
  });

  it("Should return 200 with filtered users", async () => {
    getServerSession.mockResolvedValue({
      user: {
        name: "TestUser",
        email: "test.user@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    const responseBody = {
      userId: "738f6a49-59b2-4131-8977-7cac4d3af4fg",
      username: "John1234",
      name: "John",
      profilePicture:
        "https://as2.ftcdn.net/v2/jpg/00/22/38/75/1000_F_22387576_fwwnMBKbKyLpBcK1Y5f9Z9fCtgdm1aJX.jpg",
      email: "john.doe@mychat.com",
      createdAt: new Date(),
    };

    prismaMock.user.findMany.mockResolvedValue([responseBody]);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/user?query=${query}&skip=0&take=10`
    );

    const response = await GET(mockRequest);

    expect(response.status).toBe(200);
  });

  it("Should return 500 if an internal server error occurs", async () => {
    getServerSession.mockImplementation(() => {
      throw new Error("Internal error");
    });

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/user?query=${query}`
    );

    const response = await GET(mockRequest);
    const responseJson = await response.json();

    expect(response.status).toBe(500);
    expect(responseJson).toHaveProperty("error");
  });
});

describe("POST /api/user", () => {
  it("Should return 200 with existing user information", async () => {
    const sessionUser = {
      email: "test.user@mychat.com",
      name: "TestUser",
      image: "https://avatars.githubusercontent.com/u/88277309?v=4",
    };

    getServerSession.mockResolvedValue({ user: sessionUser });

    const responseBody = {
      userId: "738f6a49-59b2-4131-8977-7cac4d3af4fg",
      username: "John1234",
      name: "John",
      profilePicture:
        "https://as2.ftcdn.net/v2/jpg/00/22/38/75/1000_F_22387576_fwwnMBKbKyLpBcK1Y5f9Z9fCtgdm1aJX.jpg",
      email: "john.doe@mychat.com",
      createdAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(responseBody);

    const response = await POST();
    const responseJson = await response.json();

    expect(responseJson).toEqual({
      user: {
        userId: expect.any(String),
        username: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        profilePicture: expect.any(String),
        createdAt: expect.any(String),
      },
    });
    expect(response.status).toBe(200);
  });

  it("Should create a new user if it does not exist and return 200", async () => {
    getServerSession.mockResolvedValue({
      user: {
        name: "TestUser",
        email: "test.user@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await POST();

    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson).toEqual({
      user: {
        userId: expect.any(String),
        username: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        profilePicture: expect.any(String),
        createdAt: expect.any(String),
      },
    });
  });

  it("Should return 500 if an internal server error occurs", async () => {
    getServerSession.mockImplementation(() => {
      throw new Error("Internal error");
    });

    const response = await POST();
    const responseJson = await response.json();

    expect(response.status).toBe(500);
    expect(responseJson).toHaveProperty("error");
  });
});
