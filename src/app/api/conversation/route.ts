import prisma from "@/utils/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user;

    if (!sessionUser || sessionUser.email === null)
      return NextResponse.json({ message: "Forbidden", status: 401 });

    const currentUser = await prisma.user.findFirst({
      where: {
        email: sessionUser.email,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found", status: 404 });
    }

    const userConversations = await prisma.userConversation.findMany({
      where: {
        userID: currentUser.userID,
      },
      select: {
        conversationId: true,
        conversation: {
          select: {
            users: {
              select: {
                user: {
                  select: {
                    userID: true,
                    username: true,
                    name: true,
                    profilePicture: true,
                  },
                },
              },
            },
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              select: {
                content: true,
              },
            },
            lastUpdated: true,
          },
        },
      },
    });

    const formattedMessagesRO = userConversations.map((userConversation) => {
      const usersExcludingCurrentUser = userConversation.conversation.users
        .filter((user) => user.user.userID !== currentUser.userID)
        .map((user) => ({
          userID: user.user.userID,
          username: user.user.username,
          name: user.user.name,
          profilePicture: user.user.profilePicture,
        }));

      return {
        conversationId: userConversation.conversationId,
        user: usersExcludingCurrentUser,
        lastMessage: userConversation.conversation.messages[0]?.content,
        updatedAt: userConversation.conversation.lastUpdated,
      };
    });

    return NextResponse.json(
      { userConversations: formattedMessagesRO },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
