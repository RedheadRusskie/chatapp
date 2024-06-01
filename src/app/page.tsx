"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useAddNewUser } from "../lib/hooks";
import { ConversationSearch } from "../components/ConversationSearch/ConversationSearch";

export default function Home() {
  useAddNewUser();

  return (
    <Flex w="100%" h="100%">
      <Box w="26em" bgColor="#1C173E">
        <ConversationSearch />
        <Box overflowY="auto" height="83vh">
          {/* Conversation card here */}
        </Box>
      </Box>
      <Box flex="1">{/* Conversation here here */}</Box>
    </Flex>
  );
}
