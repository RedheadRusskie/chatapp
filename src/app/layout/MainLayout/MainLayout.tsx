"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import { Box, ChakraProvider } from "@chakra-ui/react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Box w="100%" h="91vh" backgroundColor="var(--bg-main)">
          {children}
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
};
