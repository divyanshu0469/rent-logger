"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayoutWrapper from "./AppLayoutWapper";

const queryClient = new QueryClient();

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </AuthProvider>
        <Toaster />
      </QueryClientProvider>
    </>
  );
}
