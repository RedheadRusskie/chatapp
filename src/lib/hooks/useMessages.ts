import { useInfiniteQuery } from "react-query";
import { AxiosError } from "axios";
import { MessageResponse } from "@/interfaces";
import { fetchCurrentMessagesRequest } from "../shared";

const messageQueryKeys = {
  messageQueryKey: "conversation",
};

export const useFetchMessages = (conversationId: string) => {
  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery<MessageResponse[], AxiosError>(
      [messageQueryKeys.messageQueryKey, conversationId],
      ({ pageParam = 0 }) =>
        fetchCurrentMessagesRequest(conversationId, pageParam),
      {
        enabled: !!conversationId,
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.length < 10) return undefined;
          return allPages.length;
        },
      }
    );

  return {
    messages: data?.pages.flat() || [],
    messagesLoading: isLoading,
    messagesError: error,
    fetchNextPage,
    hasNextPage,
  };
};
