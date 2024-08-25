import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { MessageBody, MessageResponse } from "@/interfaces";
import {
  fetchCurrentMessagesRequest,
  messageMutationFunction,
} from "../shared";
import { conversationQueryKeys } from "./useConversations";

const messageQueryKeys = {
  messageQueryKey: "conversation",
};

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery<MessageResponse, AxiosError>(
      [messageQueryKeys.messageQueryKey, conversationId],
      ({ pageParam = 0 }) =>
        fetchCurrentMessagesRequest(conversationId, pageParam),
      {
        enabled: !!conversationId,
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.messages.length < 10) return;
          return allPages.length;
        },
      }
    );

  const messages =
    data?.pages
      .flatMap((page) => page.messages)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ) || [];

  const messageMutation = useMutation(
    (messageData: MessageBody) =>
      messageMutationFunction(conversationId, messageData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: messageQueryKeys.messageQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey: conversationQueryKeys.conversationKey,
        });
      },
      onError: (error: AxiosError) => {
        console.error("Error sending message:", error.message);
      },
    }
  );

  return {
    messages,
    messagesLoading: isLoading,
    messagesError: error,
    fetchNextPage,
    hasNextPage,
    messageMutation,
  };
};
