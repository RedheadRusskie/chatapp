/*
  Warnings:

  - The primary key for the `UserConversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UserConversation` table. All the data in the column will be lost.
  - Added the required column `userID` to the `UserConversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserConversation" DROP CONSTRAINT "UserConversation_userId_fkey";

-- AlterTable
ALTER TABLE "UserConversation" DROP CONSTRAINT "UserConversation_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userID" TEXT NOT NULL,
ADD CONSTRAINT "UserConversation_pkey" PRIMARY KEY ("userID", "conversationId");

-- AddForeignKey
ALTER TABLE "UserConversation" ADD CONSTRAINT "UserConversation_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
