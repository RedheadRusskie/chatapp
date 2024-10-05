import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useMutation } from "react-query";
import { AxiosError } from "axios";
import { MessageBody, MessageData, MessageResponse } from "@/interfaces";
import { useSocket } from "@/lib/hooks";
import { cryptrInstance } from "@/lib/cryptr/cryptr";
import {
  fetchCurrentMessagesRequest,
  messageMutationFunction,
} from "../shared";

const messageQueryKeys = {
  messageQueryKey: "conversation",
};

export const useMessages = (conversationId: string) => {
  const [encryptedMessage, setEncryptedMessage] = useState<MessageBody>();
  const [partialNewMessage, setPartialNewMessage] = useState<MessageData>();
  const [optimisticMessageIds, setOptimisticMessageIds] =
    useState<Set<string>>();
  const { socket } = useSocket();
  const user = sessionStorage.getItem("user");
  const parsedUser = JSON.parse(user as string).user;

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
        .map((message) => ({
          ...message,
          content: message.content
            ? cryptrInstance.decrypt(message.content)
            : message.content,
        }))
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
  }, [conversationId, currentMessages]);

  useEffect(() => {
    setCurrentMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (encryptedMessage && partialNewMessage) {
      socket.emit("sendMessage", {
        roomId: conversationId,
        messageData: {
          ...partialNewMessage,
          conversationId: conversationId,
          content: encryptedMessage.content,
        },
      });

      messageMutation.mutate({
        id: encryptedMessage.id,
        content: encryptedMessage.content,
      });
    }
  }, [encryptedMessage, partialNewMessage]);

  const handleReceiveMessage = (messageData: MessageData) => {
    if (!messageData) return;

    if (
      messageData.conversationId === conversationId &&
      !optimisticMessageIds?.has(messageData.id) &&
      messageData.content !== null
    ) {
      setCurrentMessages((prevMessages) => {
        const messageExists = prevMessages.find(
          (message) => message.id === messageData.id
        );

        if (messageExists) return prevMessages;

        const decryptedMessage = {
          ...messageData,
          content: messageData.content
            ? cryptrInstance.decrypt(messageData.content)
            : messageData.content,
        };

        return [...prevMessages, decryptedMessage];
      });
    }
  };

  const createMessage = (messageData: MessageBody) => {
    if (!messageData.content || messageData.content.trim() === "" || !user)
      return;

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

    setCurrentMessages((prevMessages) => [...prevMessages, newMessage]);
    setPartialNewMessage(newMessage);
    setOptimisticMessageIds((prevIds) => new Set(prevIds).add(newMessage.id));

    setEncryptedMessage({
      id: messageData.id,
      content: cryptrInstance.encrypt(messageData.content),
    });
  };

  const messageMutation = useMutation(
    (messageData: MessageBody) =>
      messageMutationFunction(conversationId, messageData),
    {
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
    createMessage,
  };
};
