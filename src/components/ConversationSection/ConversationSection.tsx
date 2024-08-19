import { useConversationSelect } from "@/context/ConversationContext";
import { useFetchMessages } from "@/lib/hooks/useMessages";
import { Avatar, Box, Center, Flex, Text } from "@chakra-ui/react";
import { User } from "@prisma/client";

interface ConversationSectionProps {
  conversationId: string;
  selectedConversationUser: Partial<User>;
}

export const ConversationSection: React.FC<ConversationSectionProps> = ({
  conversationId,
  selectedConversationUser,
}) => {
  const {
    messages,
    messagesLoading,
    messagesError,
    fetchNextPage,
    hasNextPage,
  } = useFetchMessages(conversationId);

  return (
    <Box
      flex="1"
      h="95%"
      bgColor="#1C173E"
      borderRadius="30px"
      overflowY="auto"
      margin="0 1em 1em 0.5em"
    >
      <Flex
        h="4em"
        bgColor="#262056"
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
    </Box>
  );
};
