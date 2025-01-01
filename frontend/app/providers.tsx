"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { WalletProvider as InternalWalletProvider } from "./WalletContext";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { store } from "@/store/store"; // Import the Redux store

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider store={store}>
      <MetaMaskProvider
        debug={true}
        sdkOptions={{
          dappMetadata: {
            name: "Misinformation Detection System",
            url: typeof window !== "undefined" ? window.location.host : "",
          },
        }}
      >
        <InternalWalletProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider> {/* Wrap children with SessionProvider */}
              <SidebarProvider>{children}</SidebarProvider>
            </SessionProvider>
          </ThemeProvider>
        </InternalWalletProvider>
      </MetaMaskProvider>
    </ReduxProvider>
  );
}