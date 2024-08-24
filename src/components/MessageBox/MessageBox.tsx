import { User } from "@prisma/client";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { MessageData } from "@/interfaces";
import { formatDate } from "@/utils/formatDate";

interface MessageBoxProps {
  messageData: MessageData | undefined;
  selectedConversationUser: Partial<User>;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  messageData,
  selectedConversationUser,
}) => {
  const isIncomingMessage =
    messageData?.sender.userId === selectedConversationUser.userId;

  const formattedDate = formatDate(messageData?.createdAt as string);

  return (
    <Flex
      align="flex-start"
      mb={6}
      width="100%"
      direction="row"
      justify={isIncomingMessage ? "flex-start" : "flex-end"}
    >
      {isIncomingMessage && (
        <Avatar src={messageData?.sender?.profilePicture as string} mr={3} />
      )}
      <Box maxWidth="60%">
        <Box
          bg={isIncomingMessage ? "#13102c" : "var(--accent)"}
          color="white"
          px={4}
          py={3}
          borderRadius="lg"
          textAlign={isIncomingMessage ? "left" : "right"}
        >
          <Text display="block" textAlign="left">
            {messageData?.content}
          </Text>
        </Box>
        <Text
          fontSize="0.8rem"
          m="0.5em"
          color="white"
          align={isIncomingMessage ? "left" : "right"}
        >
          {formattedDate}
        </Text>
      </Box>
      {!isIncomingMessage && (
        <Avatar src={messageData?.sender?.profilePicture as string} ml={3} />
      )}
    </Flex>
  );
};
