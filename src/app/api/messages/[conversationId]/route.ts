import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/prisma/db";
import { getCurrentUserByEmail } from "@/lib/shared/queries/user";
import { MessageBody, MessageData } from "@/interfaces";

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
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

    const { conversationId } = params;
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get("skip") || "0", 10);
    const take = parseInt(url.searchParams.get("take") || "10", 10);

    const queriedMessages = await prisma.directMessage.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: take,
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            userId: true,
            username: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    const messages = queriedMessages.sort(
      (prev, current) => prev.createdAt.getTime() - current.createdAt.getTime()
    );

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
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

    const requestBody: MessageBody = await request.json();

    const createMessage = await prisma.directMessage.create({
      data: {
        id: requestBody.id,
        content: requestBody.content,
        conversationId: params.conversationId,
        senderId: currentUser.userId,
      },
      include: {
        sender: {
          select: {
            userId: true,
            username: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: {
        id: params.conversationId,
      },
      data: {
        lastUpdated: createMessage.createdAt,
      },
    });

    const createMessageRO: MessageData = {
      content: createMessage.content,
      id: createMessage.id,
      createdAt: createMessage.createdAt.toISOString(),
      sender: {
        name: createMessage.sender.name,
        userId: createMessage.sender.userId,
        username: createMessage.sender.username,
        profilePicture: createMessage.sender.profilePicture,
      },
    };

    return NextResponse.json(
      { message: "Message sent successfully", createMessage: createMessageRO },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
