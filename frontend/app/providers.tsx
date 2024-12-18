// app/providers.tsx
"use client"

import React from 'react';
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MetaMaskProvider } from "@metamask/sdk-react";
import { WalletProvider as InternalWalletProvider } from "./WalletContext";

export default function Providers({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <MetaMaskProvider
      debug={true}
      sdkOptions={{
        //checkInstallation: true,
        dappMetadata: {
          name: "Misinformation Detection System",
          url: typeof window !== 'undefined' ? window.location.host : ''
        }
      }}
    >
      <InternalWalletProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </InternalWalletProvider>
    </MetaMaskProvider>
  );
}