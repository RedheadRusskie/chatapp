import React from "react";
import Image from "next/image";
import { Avatar, AvatarBadge, Box, Center, Flex, Text } from "@chakra-ui/react";
// import { Conversation } from "@prisma/client";
import styles from "./ConversationCard.module.scss";
import { Conversation } from "@prisma/client";

interface ConversationCardProps {
  conversation: Conversation;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
}) => {
  return (
    <Box
      className={styles.conversationCard}
      w="100%"
      h="5em"
      bgColor="#181437"
      color="#fff"
    >
      <Flex height="100%" alignItems="center" padding="0.8em">
        <Box mr="0.8em">
          <Avatar size="lg">
            <AvatarBadge boxSize="0.9em" bg="green.500" borderColor="#181437" />
          </Avatar>
        </Box>
        <Box>
          <Text fontWeight={500} fontSize="1.2rem"></Text>
          <Text color="#6F68A9"></Text>
        </Box>
        <Box>
          <Text marginLeft="2.5em" marginTop="-1.8em"></Text>
        </Box>
      </Flex>
    </Box>
  );
};
