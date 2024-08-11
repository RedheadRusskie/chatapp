import { User } from "@prisma/client";

export interface ConversationData {
  userConversations: [
    {
      conversationId: string;
      user: Partial<User>;
      lastMessage: string;
      updatedAt: string;
    }
  ];
}
