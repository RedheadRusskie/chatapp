import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useMutation } from "react-query";
import { AxiosError } from "axios";
import { MessageBody, MessageData, MessageResponse } from "@/interfaces";
import {
  fetchCurrentMessagesRequest,
  messageMutationFunction,
} from "../shared";
import { socket } from "../socket/socket";

const messageQueryKeys = {
  messageQueryKey: "conversation",
};

export const useMessages = (conversationId: string) => {
  const user = sessionStorage.getItem("user");

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

  const messages = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.messages)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ) || [],
    [data]
  );

  const [currentMessages, setCurrentMessages] =
    useState<MessageData[]>(messages);

  useEffect(() => {
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [conversationId]);

  useEffect(() => {
    setCurrentMessages(messages);
  }, [messages]);

  const handleReceiveMessage = (messageData: MessageData) => {
    messageData &&
      setCurrentMessages((prevMessages) => {
        const messageExists = prevMessages.find(
          (message) => message.id === messageData.id
        );

        return !messageExists ? [...prevMessages, messageData] : prevMessages;
      });
  };

  const createMessage = (messageData: MessageData) => {
    setCurrentMessages((prevMessages) => [...prevMessages, messageData]);

    socket.emit("sendMessage", {
      roomId: conversationId,
      messageData,
    });
  };

  const messageMutation = useMutation(
    (messageData: MessageBody) =>
      messageMutationFunction(conversationId, messageData),
    {
      onMutate: async (messageData) => {
        if (user === null) return;

        const parsedUser = JSON.parse(user).user;

        const newMessage: MessageData = {
          id: messageData.id,
          content: messageData.content,
          createdAt: new Date().toISOString(),
          sender: {
            name: parsedUser.name,
            userId: parsedUser.userId,
            username: parsedUser.username,
            profilePicture: parsedUser.profilePicture,
          },
        };

        createMessage(newMessage);
      },
      onError: (error: AxiosError) => {
        console.error("Error sending message:", error.message);
      },
    }
  );

  return {
    messages: currentMessages,
    messagesLoading: isLoading,
    messagesError: error,
    fetchNextPage,
    hasNextPage,
    messageMutation,
  };
};
