"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <Box w="100%" h="91vh" backgroundColor="var(--bg-main)">
            {children}
          </Box>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
