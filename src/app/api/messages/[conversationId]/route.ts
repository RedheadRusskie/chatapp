import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/prisma/db";
import { getCurrentUserByEmail } from "@/lib/shared/queries/user";

export async function GET(
  request: Request,
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

    const messages = await prisma.directMessage.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
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
      skip: skip,
      take: take,
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
