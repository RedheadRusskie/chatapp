import { vi } from "vitest";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  getCurrentUserByEmail: vi.fn(),
}));

vi.mock("next-auth", () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock("@/lib/shared/queries/user", () => ({
  getCurrentUserByEmail: mocks.getCurrentUserByEmail,
}));

describe("GET /api/conversations", () => {
  it("Should return 401 if no session exists", async () => {
    mocks.getServerSession.mockResolvedValue(null);

    const response = await GET();
    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "Forbidden", status: 401 });
  });

  it("Should return 404 if user is not found", async () => {
    mocks.getServerSession.mockResolvedValue({
      user: {
        name: "DNE",
        email: "DNE@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    mocks.getCurrentUserByEmail.mockResolvedValue(null);

    const response = await GET();
    const responseJson = await response.json();

    expect(responseJson).toEqual({ message: "User not found", status: 404 });
  });

  it("Should return 200 with formatted conversations", async () => {
    mocks.getServerSession.mockResolvedValue({
      user: {
        name: "TestUser",
        email: "test.user@mychat.com",
        image: "https://avatars.githubusercontent.com/u/88277309?v=4",
      },
    });

    mocks.getCurrentUserByEmail.mockResolvedValue({
      userId: "738f6a49-59b2-4131-8977-7cac4d3af4ff",
      username: "TestUser",
      email: "test.user@mychat.com",
      name: "Test",
      profilePicture: "https://avatars.githubusercontent.com/u/88277309?v=4",
      createdAt: new Date(),
    });

    const response = await GET();
    const responseJson = await response.json();

    const expectedResponse = {
      userConversations: [
        {
          conversationId: "efb73b13-dea5-4ba2-b004-8084092da1c4",
          user: {
            userId: "89703e85-3409-4b52-bc41-5b64e5e8e789",
            username: "Redheadrage5037",
            name: "RedheadRage",
            profilePicture:
              "https://avatars.githubusercontent.com/u/180465962?v=4",
          },
          updatedAt: "2024-10-05T21:56:49.306Z",
        },
      ],
    };

    expect(responseJson).toEqual(expectedResponse);
    expect(response.status).toBe(200);
  });
});
