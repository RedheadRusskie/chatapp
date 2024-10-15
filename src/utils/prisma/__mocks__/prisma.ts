import { beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { mockReset, mockDeep } from "vitest-mock-extended";

const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

export default prismaMock;
