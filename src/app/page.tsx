"use client";

import { useAddNewUser } from "@/lib/hooks";
import { Box, Flex } from "@chakra-ui/react";
import { UserSearhSelect } from "@/components/UserSearchSelect/UserSearchSelect";

export default function Home() {
  useAddNewUser();

  return (
    <Flex w="100%" h="100%">
      <Box w="26em" bgColor="#1C173E">
        <UserSearhSelect />
        <Box overflowY="auto" height="83vh">
          {/* Conversation card here */}
        </Box>
      </Box>
      <Box flex="1">{/* Conversation here here */}</Box>
    </Flex>
  );
}
