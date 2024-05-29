import { Search2Icon } from "@chakra-ui/icons";
import { Box, Center, Flex, Input } from "@chakra-ui/react";

export const ConversationSearch = () => {
  return (
    <Center h="4em" backgroundColor="#1C173E">
      <Box
        w="80%"
        h="60%"
        border="2px solid var(--light-main)"
        padding="0.5em 0.8em;"
        borderRadius="30px;"
      >
        <Flex alignItems="center">
          <Input
            bgColor="transparent"
            border="none"
            w="100%"
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
          <Search2Icon height="100%" color="var(--light-main)" />
        </Flex>
      </Box>
    </Center>
  );
};
