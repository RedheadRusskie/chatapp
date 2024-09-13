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

export interface MessageData {
  conversationId?: string;
  content: string | null;
  id: string;
  createdAt: string;
  sender: {
    name: string | null;
    userId: string;
    username: string;
    profilePicture: string | null;
  };
}

export interface MessageResponse {
  messages: MessageData[];
}

export interface MessageBody {
  id: string;
  content: string;
}
