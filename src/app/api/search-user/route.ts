import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { msg: "Sign in to query users." },
        { status: 401 }
      );
    }

    const query = req.nextUrl.searchParams.get("query");

    if (!query || !(query.length > 3))
      return NextResponse.json(
        { msg: "Query parameter too short or missing." },
        { status: 400 }
      );

    const queryResult = await prisma.user.findMany({
      select: {
        userID: true,
        username: true,
        name: true,
        profilePicture: true,
      },
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json({ queryResult }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}