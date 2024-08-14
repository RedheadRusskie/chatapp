import prisma from "@/utils/prisma/db";

export const getCurrentUserByEmail = async (email: string) =>
  await prisma.user.findFirst({
    where: {
      email: email as string,
    },
  });
