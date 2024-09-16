"use client";

import { useMemo } from "react";
import { Box, Center, Flex, Spinner, useToast } from "@chakra-ui/react";
import { ConversationCard } from "@/components/ConversationCard/ConversationCard";
import { UserSearchSelect } from "@/components/UserSearchSelect/UserSearchSelect";
import { useConversationSelect } from "@/context/ConversationContext";
import { ConversationSection } from "@/components/ConversationSection/ConversationSection";
import { useConversations } from "@/lib/hooks/useConversations";
import { useAddNewUser, useSocket } from "@/lib/hooks";

export default function Home() {
  useAddNewUser();
  const { conversations, conversationsLoading, conversationsError } =
    useConversations();
  const { selectedConversation, dispatch } = useConversationSelect();
  const { onlineUsers } = useSocket();
  const toast = useToast();

  if (conversationsError) {
    toast({
      title:
        conversationsError.message || "An error occurred loading conversations",
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "top",
    });
  }

  const selectedConversationUser = useMemo(
    () =>
      conversations.find(
        (conversation) =>
          conversation.conversationId ===
          selectedConversation.selectedConversationId
      ),
    [conversations, selectedConversation.selectedConversationId]
  );

  return (
    <Flex w="100%" h="100%">
      <Box
        w="26em"
        bgColor="#1C173E"
        borderRadius="30px"
        margin="0 0.5em 1em 1em"
        h="95%"
      >
        <UserSearchSelect />
        <Box overflowY="auto" h="70%">
          {conversationsLoading && (
            <Center h="80%">
              <Spinner color="white" size="lg" />
            </Center>
          )}
          {conversations &&
            conversations.map((conversation) => (
              <ConversationCard
                onClick={() =>
                  dispatch({
                    type: "SELECT",
                    payload: conversation.conversationId,
                  })
                }
                key={conversation.conversationId}
                user={conversation.user}
                lastMessage={conversation.lastMessage}
                onlineUsers={onlineUsers}
                updatedAt={conversation.updatedAt}
              />
            ))}
        </Box>
      </Box>
      {selectedConversation.selectedConversationId &&
        selectedConversationUser && (
          <ConversationSection
            conversationId={selectedConversation.selectedConversationId}
            selectedConversationUser={selectedConversationUser.user}
            onlineUsers={onlineUsers}
          />
        )}
    </Flex>
  );
}
