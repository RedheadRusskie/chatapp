"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Conversation } from "@prisma/client";
import { useAddNewUser } from "../lib/hooks";
import { ConversationSearch } from "../components/ConversationSearch/ConversationSearch";
import { useEffect } from "react";
import initSocket from "../lib/socket/socket";
import axios from "axios";

interface ConversationType extends Partial<Conversation> {}

export default function Home() {
  useAddNewUser();

  useEffect(() => {
    const socket = initSocket();
    console.log("Attempting to connect...");

    socket.on("connect", () => {
      console.log(`Connected: ${socket.id}`);
    });

    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

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
