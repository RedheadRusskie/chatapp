import { vi } from "vitest";
import { NextRequest } from "next/server";
import prismaMock from "@/utils/prisma/__mocks__/prisma";
import { GET } from "./route";

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

describe("GET /api/users/search", () => {
  const query = "john";

  it("Should return 401 if no session exists", async () => {
    getServerSession.mockResolvedValue(null);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/users/search?query=${query}`
    );

    const response = await GET(mockRequest, { skip: "0", take: "10" });

    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "Sign in to query users." });
    expect(response.status).toBe(401);
  });

  it("Should return 406 if query parameter is missing or too short", async () => {
    getServerSession.mockResolvedValue({
      user: {
        name: "TestUser",
        email: "test.user@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    const mockRequestShort = new NextRequest(
      `http://localhost:3000/api/users/search?query=jo`
    );

    const responseShort = await GET(mockRequestShort, {
      skip: "0",
      take: "10",
    });

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

    getCurrentUserByEmail.mockResolvedValue({
      userId: "738f6a49-59b2-4131-8977-7cac4d3af4aa",
      username: "TestUser",
      email: "test.user@mychat.com",
      name: "Test",
      profilePicture: "https://avatars.githubusercontent.com/u/88277309?v=4",
      createdAt: new Date(),
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
      `http://localhost:3000/api/users/search?query=${query}`
    );

    const response = await GET(mockRequest, { skip: "0", take: "10" });
    const responseJson = await response.json();

    expect(responseJson).toEqual({
      queryResult: [
        {
          userId: responseBody.userId,
          username: responseBody.username,
          name: responseBody.name,
          profilePicture: responseBody.profilePicture,
        },
      ],
    });
    expect(response.status).toBe(200);
  });

  it("Should return 200 with an empty array if no user was found", async () => {
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

    prismaMock.user.findMany.mockResolvedValue([]);

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/users/search?query=user-does-not-exist`
    );

    const response = await GET(mockRequest, { skip: "0", take: "10" });
    const responseJson = await response.json();

    expect(responseJson).toEqual({ queryResult: [] });
    expect(response.status).toBe(200);
  });

  it("Should return 500 if an internal server error occurs", async () => {
    getServerSession.mockImplementation(() => {
      throw new Error("Internal error");
    });

    const mockRequest = new NextRequest(
      `http://localhost:3000/api/users/search?query=${query}`
    );

    const response = await GET(mockRequest, { skip: "0", take: "10" });

    const responseJson = await response.json();

    expect(response.status).toBe(500);
    expect(responseJson).toHaveProperty("error");
  });
});
