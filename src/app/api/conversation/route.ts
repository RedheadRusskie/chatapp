import prisma from "@/utils/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getCurrentUserByEmail } from "@/lib/shared/queries/user";

export async function GET() {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user;

    if (!sessionUser || sessionUser.email === null)
      return NextResponse.json({ message: "Forbidden", status: 401 });

    const currentUser = await getCurrentUserByEmail(
      session.user?.email as string
    );

    if (!currentUser)
      return NextResponse.json({ message: "User not found", status: 404 });

    const userConversations = await prisma.userConversation.findMany({
      where: {
        userId: currentUser.userId,
      },
      select: {
        conversationId: true,
        conversation: {
          select: {
            users: {
              select: {
                user: {
                  select: {
                    userId: true,
                    username: true,
                    name: true,
                    profilePicture: true,
                  },
                },
              },
            },
            messages: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
              select: {
                content: true,
              },
            },
            lastUpdated: true,
          },
        },
      },
      orderBy: {
        conversation: {
          lastUpdated: "desc",
        },
      },
    });

    const formattedMessagesRO = userConversations.map((userConversation) => {
      const usersExcludingCurrentUser = userConversation.conversation.users
        .filter((user) => user.user.userId !== currentUser.userId)
        .map((user) => ({
          userId: user.user.userId,
          username: user.user.username,
          name: user.user.name,
          profilePicture: user.user.profilePicture,
        }));

      return {
        conversationId: userConversation.conversationId,
        user: usersExcludingCurrentUser[0],
        lastMessage: userConversation.conversation.messages[0]?.content,
        updatedAt: userConversation.conversation.lastUpdated,
      };
    });

    return NextResponse.json(
      { userConversations: formattedMessagesRO },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
