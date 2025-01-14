"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/context/AuthContext";
import { ConversationProvider } from "@/context/ConversationContext";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <ConversationProvider>
            <Box
              overflow="hidden"
              w="100%"
              h="90vh"
              backgroundColor="var(--bg-main)"
            >
              {children}
            </Box>
          </ConversationProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
