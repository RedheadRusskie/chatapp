import { useEffect, useRef, useState } from "react";
import { useMessages } from "@/lib/hooks/useMessages";
import { User } from "@prisma/client";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { MessageBox } from "../MessageBox/MessageBox";
import { MessageBody } from "@/interfaces";

interface ConversationSectionProps {
  conversationId: string;
  selectedConversationUser: Partial<User>;
}

export const ConversationSection: React.FC<ConversationSectionProps> = ({
  conversationId,
  selectedConversationUser,
}) => {
  const [inputValue, setInputValue] = useState<string>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    messagesLoading,
    fetchNextPage,
    hasNextPage,
    messageMutation,
  } = useMessages(conversationId);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    if (
      messagesContainerRef.current &&
      messagesContainerRef.current.scrollTop === 0 &&
      hasNextPage &&
      !messagesLoading
    ) {
      fetchNextPage();
    }
  };

  const handleSendMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !inputValue) return;

    const messageRequestBody: MessageBody = {
      content: inputValue as string,
    };

    messageMutation.mutate(messageRequestBody);
    setInputValue("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  return (
    <Box
      flex="1"
      h="95%"
      bgColor="#1C173E"
      borderRadius="30px"
      margin="0 1em 1em 0.5em"
      position="relative"
    >
      <Flex
        h="4em"
        borderRadius="30px 30px 0 0"
        bgColor="var(--accent)"
        boxShadow="0px 1px 28px -6px rgba(0,0,0,0.39)"
      >
        <Center gap="1em" padding="1em 0.5em">
          <Avatar
            src={selectedConversationUser.profilePicture as string}
            border="3px solid transparent"
            boxShadow={`0 0 0 2px ${
              selectedConversationUser.active ? "#48BB78" : "#718096"
            }`}
          />
          <Text color="white" fontSize="1.4rem">
            {selectedConversationUser.name}
          </Text>
        </Center>
      </Flex>
      <Box
        onScroll={handleScroll}
        ref={messagesContainerRef}
        flex="1"
        overflowY="auto"
        p={5}
        maxH="90.8%"
        paddingBottom="3em"
      >
        {messagesLoading && (
          <Center h="100%">
            <Spinner color="white" size="lg" />
          </Center>
        )}
        {messages.length > 0 && (
          <>
            {messages.map((messageData) => (
              <MessageBox
                key={messageData.id}
                messageData={messageData}
                selectedConversationUser={selectedConversationUser}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </Box>
      <Box
        p="0.5em 1em"
        position="absolute"
        bottom="10px"
        left="0"
        right="0"
        zIndex="999"
      >
        <Flex
          maxW="40em"
          w="100%"
          mx="auto"
          align="center"
          justify="space-between"
          gap={2}
        >
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleSendMessage}
            borderColor="var(--light-main)"
            backgroundColor="#1C173E"
            focusBorderColor="white"
            color="white"
            _placeholder={{
              color: "var(--light-main)",
            }}
            borderRadius="30px"
            placeholder="Enter a message"
          />
        </Flex>
      </Box>
    </Box>
  );
};
