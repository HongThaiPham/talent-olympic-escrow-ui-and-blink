"use client";
import React, { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import SolanaProvider from "./SolanaProvider";
import AppThemeProvider from "./AppThemeProvider";
const queryClient = new QueryClient();
const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <Toaster richColors position="bottom-right" />
        <SolanaProvider>{children}</SolanaProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
