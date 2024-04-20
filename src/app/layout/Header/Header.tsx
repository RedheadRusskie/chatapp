"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import logo from "../../../../public/assets/logo.png";
import { Text } from "@chakra-ui/react";

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <Flex
      as="nav"
      height="80px"
      align="center"
      justify="space-between"
      padding="5"
      backgroundColor="#131029"
    >
      <Box display="flex" alignItems="center" gap="0.5em">
        <Image
          src={logo}
          alt="Logo"
          width={50}
          height={50}
          style={{
            pointerEvents: "none",
            marginLeft: "3em",
            userSelect: "none",
          }}
        />
        <Text fontSize="1.5rem" fontWeight={800} color="#fff">
          MyChat
        </Text>
      </Box>
      <Spacer />
      {session?.user ? (
        <Box>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt="User Avatar"
              style={{ marginRight: "3em", borderRadius: "100%" }}
              width={45}
              height={45}
            />
          )}
        </Box>
      ) : (
        <Box>{/* Render a default avatar or sign in button */}</Box>
      )}
    </Flex>
  );
};

export default Navbar;
