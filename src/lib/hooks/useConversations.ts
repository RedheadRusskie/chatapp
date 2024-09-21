import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";
import {
  ConversationData,
  CachedConversation,
  ConversationPayload,
} from "@/interfaces";
import { useSocket } from "@/lib/hooks";
import {
  createConversationMutationFunction,
  fetchConversationsRequest,
} from "../shared";

const updateConversation = (
  conversations: CachedConversation[],
  newMessage: { conversationId: string; content: string | null }
) =>
  conversations.map((conversation) =>
    conversation.conversationId === newMessage?.conversationId
      ? {
          ...conversation,
          lastMessage: newMessage?.content ?? conversation.lastMessage,
          updatedAt: new Date().toISOString(),
        }
      : conversation
  );

const sortConversationsByDate = (conversations: CachedConversation[]) =>
  [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

export const useConversations = () => {
  const { data, isLoading, error } = useQuery<ConversationData, AxiosError>({
    queryKey: "conversation",
    queryFn: fetchConversationsRequest,
  });

  const [conversations, setConversations] = useState<CachedConversation[]>();
  const { socket } = useSocket();

  useEffect(() => {
    if (data?.userConversations) setConversations(data.userConversations);
  }, [data]);

  useEffect(() => {
    const handleNewMessage = (newMessage: {
      conversationId: string;
      content: string | null;
    }) => {
      setConversations((prevConversations) => {
        if (!prevConversations) return;

        return sortConversationsByDate(
          updateConversation(prevConversations, newMessage)
        );
      });
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket]);

  const conversationMutation = useMutation<
    ConversationPayload,
    AxiosError,
    ConversationPayload
  >(
    (conversationData: ConversationPayload) =>
      createConversationMutationFunction(conversationData),
    {
      onError: (error) => {
        console.error("Failed to create conversation:", error);
      },
    }
  );

  return {
    initialConversations: data?.userConversations,
    conversations,
    conversationsLoading: isLoading,
    conversationsError: error,
    setConversations,
    conversationMutation,
  };
};
