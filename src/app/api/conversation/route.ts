import prisma from "@/utils/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getCurrentUserByEmail } from "@/lib/shared/queries/user";

export async function GET() {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user;

    if (!sessionUser || !sessionUser.email)
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user;

    if (!sessionUser || !sessionUser.email)
      return NextResponse.json({ message: "Forbidden", status: 401 });

    const currentUser = await getCurrentUserByEmail(sessionUser.email);

    if (!currentUser)
      return NextResponse.json({ message: "User not found", status: 404 });

    const { conversationId, participantUserId } = await request.json();

    if (!participantUserId)
      return NextResponse.json(
        { message: "Participant user ID is required" },
        { status: 400 }
      );

    const participant = await prisma.user.findUnique({
      where: { userId: participantUserId },
    });

    if (!participant)
      return NextResponse.json(
        { message: "Participant user not found" },
        { status: 404 }
      );

    const newConversation = await prisma.conversation.create({
      data: {
        id: conversationId,
      },
    });

    await prisma.userConversation.createMany({
      data: [
        {
          userId: currentUser.userId,
          conversationId: newConversation.id,
        },
        {
          userId: participant.userId,
          conversationId: newConversation.id,
        },
      ],
    });

    return NextResponse.json(
      { conversation: newConversation },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
