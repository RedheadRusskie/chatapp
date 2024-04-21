import { useState } from "react";
import { signIn } from "next-auth/react";
import { Center, Flex, Heading, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PillButton } from "../PillButton/PillButton";

export default function LoginContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const containerWidth = useBreakpointValue({
    base: "100%",
    md: "50%",
    lg: "40%",
  });

  const signInWithGitHub = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("github", {
        redirect: true,
      });
      if (result?.error) {
        console.error("Failed to sign in with GitHub:", result.error);
      }
    } catch (error) {
      console.error("Failed to sign in with GitHub:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center width="100%" height="70%">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: containerWidth, maxWidth: "1000px", padding: "2em" }}
      >
        <Heading fontWeight="800" fontSize="5rem" color="#fff" mb="0.5em">
          Sign in
        </Heading>
        <Center>
          <Flex direction="column" gap={3} w="100%">
            <PillButton
              onClick={signInWithGitHub}
              isLoading={isLoading}
              styleType="primary"
            >
              Continue with GitHub
            </PillButton>
            <PillButton
              backgroundColor="red.600"
              color="white"
              _hover={{ backgroundColor: "red.700" }}
            >
              Continue with Google
            </PillButton>
            <PillButton styleType="secondary">I have my own account</PillButton>
          </Flex>
        </Center>
      </motion.div>
    </Center>
  );
}
