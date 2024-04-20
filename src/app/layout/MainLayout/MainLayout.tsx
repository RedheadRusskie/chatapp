"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ChakraProvider>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
};
