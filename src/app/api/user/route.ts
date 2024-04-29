import prisma from "@/app/utils/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Config, uniqueUsernameGenerator } from "unique-username-generator";

export async function GET() {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user;

    if (!sessionUser)
      return NextResponse.json({ msg: "Forbidden", status: 401 });

    const user = await prisma.user.findUnique({
      where: {
        email: sessionUser.email as string,
      },
    });

    if (!user)
      return NextResponse.json({ msg: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user;

    console.log("test", sessionUser);

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
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
