import { Avatar, Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import styles from "./AvatarMenu.module.scss";

interface AvatarMenuProps {
  session: Session | null;
}

export const AvatarMenu: React.FC<AvatarMenuProps> = ({ session }) => {
  return session?.user ? (
    <Box paddingRight="3em">
      <Avatar
        className={styles.avatar}
        // Required
        cursor="pointer"
        // Required
        borderRadius="100%"
        paddingTop="0.2em"
        marginTop="0.2em"
        width="3em"
        name={session?.user?.name as string}
        src={session?.user?.image as string}
      />
    </Box>
  ) : (
    <Box paddingRight="3em" paddingTop="0.2em">
      <Avatar
        className={styles.avatar}
        borderRadius="100%"
        marginTop="0.2em"
        width="3em"
        bg="var(--bg-dark-main)"
      />
    </Box>
  );
};
