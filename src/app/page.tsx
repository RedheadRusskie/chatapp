"use client";

import { useAddNewUser } from "@/lib/hooks";
import { Box, Flex } from "@chakra-ui/react";
import { UserSearhSelect } from "@/components/UserSearchSelect/UserSearchSelect";
import { ConversationCard } from "@/components/ConversationCard/ConversationCard";

export default function Home() {
  useAddNewUser();

  return (
    <Flex w="100%" h="100%">
      <Box w="26em" bgColor="#1C173E">
        <UserSearhSelect />
        <Box overflowY="auto" height="83vh">
          {/* Conversation card here */}
          {/* <ConversationCard /> */}
        </Box>
      </Box>
      <Box flex="1">{/* Conversation here */}</Box>
    </Flex>
  );
}
