import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import styles from "./AvatarMenu.module.scss";

interface AvatarMenuProps {
  session: Session | null;
}

export const AvatarMenu: React.FC<AvatarMenuProps> = ({ session }) => {
  const handleSignOut = () => {
    Cookies.remove("next-auth.session-token");
    signOut();
  };

  return session?.user ? (
    <Box className={styles.avatarWrapper}>
      <Menu>
        <MenuButton>
          <Avatar
            className={styles.avatar}
            // Required
            borderRadius="100%"
            src={session?.user?.image as string}
          />
        </MenuButton>
        <MenuList className={styles.menuList}>
          <MenuItem className={styles.menuItem} onClick={handleSignOut}>
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  ) : (
    <Box className={styles.avatarWrapper}>
      <Avatar className={styles.avatarEmpty} />
    </Box>
  );
};
