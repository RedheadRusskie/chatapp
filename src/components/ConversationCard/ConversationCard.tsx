import React, { MouseEventHandler } from "react";
import { Avatar, AvatarBadge, Box, Center, Flex, Text } from "@chakra-ui/react";
import { User } from "@prisma/client";
import dayjs from "dayjs";
import styles from "./ConversationCard.module.scss";

interface ConversationCardProps {
  user: Partial<User>;
  lastMessage: string;
  updatedAt: string;
  onClick: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  user,
  lastMessage,
  updatedAt,
  onClick,
}) => {
  const formatDate = (isoString: string): string => {
    const now = dayjs();
    const messageTime = dayjs(isoString);
    const hoursDiff = now.diff(messageTime, "hour");

    if (hoursDiff < 24) return messageTime.format("HH:mm");
    return messageTime.format("DD/MM");
  };

  const truncateMessage = (message: string) =>
    message.substring(0, 10).concat("..");

  return (
    <Box
      className={styles.conversationCard}
      onClick={() => onClick()}
      w="100%"
      h="5em"
      bgColor="#181437"
      color="#fff"
    >
      <Flex height="100%" alignItems="center" padding="0.8em">
        <Box mr="0.8em">
          <Avatar size="lg" src={user.profilePicture || undefined}>
            <AvatarBadge
              boxSize="0.9em"
              bg={user.active ? "green.500" : "gray.500"}
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
        <Text marginLeft="8em" marginTop="-1.8em">
          {formatDate(updatedAt)}
        </Text>
      </Flex>
    </Box>
  );
};
