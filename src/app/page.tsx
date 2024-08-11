"use client";

import { useAddNewUser, useConversations } from "@/lib/hooks";
import { Box, Flex, getToken, useToast } from "@chakra-ui/react";
import { UserSearhSelect } from "@/components/UserSearchSelect/UserSearchSelect";
import { ConversationCard } from "@/components/ConversationCard/ConversationCard";

export default function Home() {
  useAddNewUser();
  const { conversations, conversationsLoading, conversationsError } =
    useConversations();
  const toast = useToast();

  if (conversationsError)
    toast({
      title: conversationsError.message,
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "top",
    });

  return (
    <Flex w="100%" h="96%">
      <Box
        w="26em"
        bgColor="#1C173E"
        borderRadius="30px"
        margin="0 1em 1em 1em"
      >
        <UserSearhSelect />
        <Box overflowY="auto" height="83vh">
          {conversations?.userConversations.map((conversation) => (
            <ConversationCard
              key={conversation.conversationId}
              user={conversation.user}
              lastMessage={conversation.lastMessage}
              updatedAt={conversation.updatedAt}
            />
          ))}
        </Box>
      </Box>
      <Box flex="1">{/** Conversation here */}</Box>
    </Flex>
  );
}
