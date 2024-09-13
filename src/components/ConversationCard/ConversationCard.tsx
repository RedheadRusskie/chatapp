import React from "react";
import { Avatar, AvatarBadge, Box, Flex, Text } from "@chakra-ui/react";
import { User } from "@prisma/client";
import { formatDate } from "@/utils/formatDate";
import styles from "./ConversationCard.module.scss";

interface ConversationCardProps {
  user: Partial<User>;
  lastMessage: string;
  updatedAt: string;
  onlineUsers: string[] | undefined;
  onClick: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  user,
  lastMessage,
  updatedAt,
  onlineUsers,
  onClick,
}) => {
  const formattedDate = formatDate(updatedAt);

  const truncateMessage = (message: string) =>
    message ? message.substring(0, 10).concat("..") : null;

  const userOnline = onlineUsers?.find((userId) => userId === user.userId);

  return (
    <Box
      className={styles.conversationCard}
      onClick={() => onClick()}
      w="100%"
      h="5em"
      bgColor="#181437"
      color="#fff"
    >
      <Flex
        height="100%"
        alignItems="center"
        padding="0.8em"
        position="relative"
      >
        <Box mr="0.8em">
          <Avatar size="lg" src={user.profilePicture || undefined}>
            <AvatarBadge
              boxSize="0.9em"
              bg={userOnline ? "green.500" : "gray.500"}
              borderColor="#181437"
              borderWidth="4px"
            />
          </Avatar>
        </Box>
        <Box>
          <Flex fontSize="1.1rem" gap="0.5em">
            <Text>{user.name}</Text>
            <Text color="#6F68A9">@{user.username}</Text>
          </Flex>
          <Text color="#6F68A9">{truncateMessage(lastMessage)}</Text>
        </Box>
        <Text
          position="absolute"
          top="0.8em"
          right="1em"
          fontSize="0.9rem"
          color="white"
        >
          {formattedDate}
        </Text>
      </Flex>
    </Box>
  );
};
