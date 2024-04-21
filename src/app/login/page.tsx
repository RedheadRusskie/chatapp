"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginContainer from "../components/LoginForm/LoginContainer";
import { Box } from "@chakra-ui/react";

const LoginPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [router, status]);

  return <LoginContainer />;
};

export default LoginPage;
