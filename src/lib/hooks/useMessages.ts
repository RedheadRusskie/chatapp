import { useInfiniteQuery } from "react-query";
import { AxiosError } from "axios";
import { MessageResponse } from "@/interfaces";
import { fetchCurrentMessagesRequest } from "../shared";

const messageQueryKeys = {
  messageQueryKey: "conversation",
};

export const useFetchMessages = (conversationId: string) => {
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

  return {
    messages,
    messagesLoading: isLoading,
    messagesError: error,
    fetchNextPage,
    hasNextPage,
  };
};
