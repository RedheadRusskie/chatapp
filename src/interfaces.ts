import { User } from "@prisma/client";

export interface UserConversations {
  conversationId: string;
  user: Partial<User>;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationData {
  userConversations: UserConversations[];
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

export interface CachedConversation {
  conversationId: string;
  user: Partial<User>;
  lastMessage: string | null;
  updatedAt: Date | string;
}

export interface ConversationPayload {
  conversationId: string;
  participantUserId: string;
}
