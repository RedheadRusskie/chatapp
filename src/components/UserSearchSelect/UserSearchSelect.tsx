import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useDebouncedState, useUser } from "@/lib/hooks";
import { Search2Icon, WarningIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { CachedConversation } from "@/interfaces";
import { useConversationSelect } from "@/context/ConversationContext";

interface UserSearchSelectProps {
  conversations: CachedConversation[];
  setConversations: Dispatch<SetStateAction<CachedConversation[] | undefined>>;
}

export const UserSearchSelect: React.FC<UserSearchSelectProps> = ({
  conversations,
  setConversations,
}) => {
  const [query, setQuery] = useDebouncedState<string | null>(null, 400);
  const searchResultsContainerRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    usersQueryResult,
    userQueryLoading,
    userQueryError,
    fetchNextPage,
    hasNextPage,
  } = useUser(query);
  const { dispatch } = useConversationSelect();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        searchResultsContainerRef.current &&
        !searchResultsContainerRef.current.contains(event.target as Node)
      )
        onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, isOpen]);

  if (userQueryError) {
    toast({
      title: userQueryError.message,
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "top",
    });
  }

  const handleScroll = () => {
    if (
      searchResultsContainerRef.current &&
      searchResultsContainerRef.current.scrollTop +
        searchResultsContainerRef.current.clientHeight >=
        searchResultsContainerRef.current.scrollHeight &&
      hasNextPage
    )
      fetchNextPage();
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value || null);

      if (event.target.value) onOpen();
      else onClose();
    },
    [onClose, onOpen, setQuery]
  );

  const handleClickUser = (user: Partial<User>) => {
    const conversationUserExists = conversations.find(
      (conversation) => conversation.user.userId === user.userId
    );

    if (conversationUserExists) return;

    const cachedConversationObject: CachedConversation = {
      // ID generated here for consistency during optimistic UI updates
      conversationId: uuidv4(),
      user: user,
      lastMessage: null,
      updatedAt: new Date(),
    };

    setConversations((prevConversations) => [
      cachedConversationObject,
      ...(prevConversations || []),
    ]);

    dispatch({
      type: "SELECT",
      payload: cachedConversationObject.conversationId,
    });

    onClose();
  };

  return (
    <Center
      h="4em"
      flexDir="column"
      backgroundColor="#1C173E"
      borderRadius="30px"
    >
      <Box
        width="80%"
        h="60%"
        border="2px solid var(--light-main)"
        padding="0.5em 0.8em;"
        borderRadius="30px;"
      >
        <Flex alignItems="center">
          <Input
            onChange={(event) => handleInputChange(event)}
            bgColor="transparent"
            border="none"
            width="100%"
            height="100%"
            _focus={{
              boxShadow: "none",
              outlineWidth: 0,
            }}
            _placeholder={{ color: "var(--light-main)" }}
            color="#fff"
            variant="unstyled"
            mr="7px"
            placeholder="Search conversations"
          />
          {userQueryLoading ? (
            <Spinner size="sm" color="var(--light-main)" />
          ) : (
            <Search2Icon height="100%" color="var(--light-main)" />
          )}
        </Flex>
      </Box>
      {isOpen && usersQueryResult && (
        <Box
          ref={searchResultsContainerRef}
          maxH="20em"
          overflowY="scroll"
          position="absolute"
          top="9em"
          minW="20.8em"
          bgColor="white"
          borderRadius="10px"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.3)"
          zIndex="999"
          left="3.5em"
          backgroundColor="var(--bg-main)"
          onScroll={handleScroll}
        >
          {!userQueryLoading && usersQueryResult.length === 0 && (
            <Center color="white" pt="1em">
              <Flex
                gap="0.5em"
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <WarningIcon fontSize="1.5rem" color="var(--light-main)" />
                No users found
              </Flex>
            </Center>
          )}
          <List>
            {usersQueryResult.map((user) => (
              <ListItem
                transition="0.3s"
                color="white"
                borderRadius="10px"
                key={user.userId}
                padding="0.5em"
                _hover={{ backgroundColor: "var(--hover)", cursor: "pointer" }}
                onClick={() => handleClickUser(user)}
              >
                <Flex gap="0.5em">
                  <Avatar src={user.profilePicture ?? undefined} size="xs" />
                  <Text>{user.name}</Text>
                  <Text color="var(--light-main)">@{user.username}</Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Center>
  );
};
