"use client";

import { useMemo } from "react";
import { useAddNewUser, useConversations } from "@/lib/hooks";
import { Box, Center, Flex, Spinner, useToast } from "@chakra-ui/react";
import { UserSearhSelect } from "@/components/UserSearchSelect/UserSearchSelect";
import { ConversationCard } from "@/components/ConversationCard/ConversationCard";
import { useConversationSelect } from "@/context/ConversationContext";
import { ConversationSection } from "@/components/ConversationSection/ConversationSection";

export default function Home() {
  useAddNewUser();
  const { conversations, conversationsLoading, conversationsError } =
    useConversations();
  const { selectedConversation, dispatch } = useConversationSelect();
  const toast = useToast();

  if (conversationsError)
    toast({
      title: conversationsError.message,
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "top",
    });

  const selectedConversationUser = useMemo(
    () =>
      conversations?.userConversations.find(
        (userConversation) =>
          userConversation.conversationId ===
          selectedConversation.selectedConversationId
      ),
    [
      conversations?.userConversations,
      selectedConversation.selectedConversationId,
    ]
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
        <UserSearhSelect />
        <Box overflowY="auto" h="70%">
          {conversationsLoading && (
            <Center h="80%">
              <Spinner color="white" size="lg" />
            </Center>
          )}
          {conversations?.userConversations.map((conversation) => (
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
          />
        )}
    </Flex>
  );
}
