"use client";
import { useState } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

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
    <Stack spacing={4}>
      <Button onClick={signInWithGitHub} isLoading={isLoading}>
        Continue with GitHub
      </Button>
    </Stack>
  );
}
