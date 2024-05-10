"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { AvatarMenu } from "@/components/AvatarMenu/AvatarMenu";
import styles from "./Header.module.scss";
import logo from "../../../public/assets/logo.png";

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <Flex
      as="nav"
      height="80px"
      align="center"
      justify="space-between"
      backgroundColor="var(--bg-main)"
    >
      <Box
        paddingLeft="3em"
        userSelect="none"
        display="flex"
        alignItems="center"
        gap="0.5em"
      >
        <Image
          className={styles.image}
          src={logo}
          alt="Logo"
          width={50}
          height={50}
        />
        <Text fontSize="1.5rem" fontWeight={800} color="#fff">
          MyChat
        </Text>
      </Box>
      <Spacer />
      <AvatarMenu session={session} />
    </Flex>
  );
};

export default Navbar;
