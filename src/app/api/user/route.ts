import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Config, uniqueUsernameGenerator } from "unique-username-generator";
import prisma from "@/utils/prisma/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user;

    if (!sessionUser)
      return NextResponse.json({ message: "Forbidden" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "10");

    if (query && query.length < 4)
      return NextResponse.json(
        { message: "Query parameter too short or missing." },
        { status: 406 }
      );

    if (query) {
      const queryResult = await prisma.user.findMany({
        select: {
          userId: true,
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
        skip,
        take,
      });

      return NextResponse.json({ queryResult }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email as string },
    });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user;

    const userExists = await prisma.user.findUnique({
      where: {
        email: sessionUser!.email as string,
      },
    });

    if (await userExists)
      return NextResponse.json({ user: userExists }, { status: 200 });

    const config: Config = {
      dictionaries: [[sessionUser?.name as string]],
      separator: "",
      style: "capital",
      randomDigits: 4,
    };

    const newUser = await prisma.user.create({
      data: {
        email: sessionUser!.email as string,
        name: sessionUser!.name as string,
        username: uniqueUsernameGenerator(config),
        profilePicture: sessionUser!.image,
      },
    });

    return NextResponse.json({ newUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
