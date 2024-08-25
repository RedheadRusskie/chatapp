import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { fetchConversationsRequest } from "../shared";
import { ConversationData } from "@/interfaces";

export const conversationQueryKeys = {
  conversationKey: "conversation",
};

export const useConversations = () => {
  const { data, isLoading, error } = useQuery<ConversationData, AxiosError>({
    queryKey: conversationQueryKeys.conversationKey,
    queryFn: fetchConversationsRequest,
  });

  return {
    conversations: data,
    conversationsLoading: isLoading,
    conversationsError: error,
  };
};
