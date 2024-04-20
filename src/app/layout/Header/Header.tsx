"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  WrapItem,
} from "@chakra-ui/react";
import logo from "../../../../public/assets/logo.png";
import { Text } from "@chakra-ui/react";
import { PhoneIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";

import styles from "./Header.module.scss";
import { AvatarMenu } from "@/app/components/AvatarMenu/AvatarMenu";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Flex
      as="nav"
      height="80px"
      align="center"
      justify="space-between"
      padding="5"
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
