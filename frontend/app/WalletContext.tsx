"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request?: <T = any>(request: { method: string; params?: unknown[] }) => Promise<T>;
      enable?: () => Promise<string[]>;
    };
  }
}

interface WalletContextType {
  account: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sdk, connected, account: sdkAccount } = useSDK();
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  // Helper function to safely set account
  const safeSetAccount = (accounts: string[] | null | undefined) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setCurrentAccount(accounts[0]);
    } else if (typeof accounts === 'string') {
      setCurrentAccount(accounts);
    } else {
      setCurrentAccount(null);
    }
  };

  // Comprehensive account retrieval method
  const retrieveAccount = async () => {
    console.log("Attempting to retrieve account through multiple methods...");

    // Method 1: Window Ethereum (Modern MetaMask)
    if (typeof window !== 'undefined' && window.ethereum?.isMetaMask) {
      try {
        const accounts = await (window.ethereum as any).request({ 
          method: 'eth_accounts' 
        }) as string[] | null;
        
        console.log("Ethereum Accounts (eth_accounts):", accounts);
        safeSetAccount(accounts);
        
        if (accounts && accounts.length > 0) {
          return accounts[0];
        }
      } catch (error) {
        console.error("eth_accounts method failed:", error);
      }

      // Fallback: Older MetaMask enable method
      try {
        const accounts = await window.ethereum.enable() as string[];
        console.log("Ethereum Accounts (enable()):", accounts);
        safeSetAccount(accounts);
        
        if (accounts && accounts.length > 0) {
          return accounts[0];
        }
      } catch (error) {
        console.error("enable() method failed:", error);
      }
    }

    // Method 2: SDK Account
    if (sdkAccount) {
      console.log("Using SDK Account:", sdkAccount);
      setCurrentAccount(sdkAccount);
      return sdkAccount;
    }

    // If all methods fail
    console.warn("No account could be retrieved");
    setCurrentAccount(null);
    return null;
  };

  // Initial and reconnection check
  useEffect(() => {
    console.log("Connection Status Changed:", { connected, sdkAccount });

    if (connected) {
      retrieveAccount();
    } else {
      setCurrentAccount(null);
    }
  }, [connected, sdkAccount]);

  const connect = async () => {
    try {
      console.log("Attempting to connect wallet...");

      // Modern MetaMask connection
      if (typeof window !== 'undefined' && window.ethereum?.isMetaMask) {
        try {
          const accounts = await (window.ethereum as any).request({ 
            method: 'eth_requestAccounts' 
          }) as string[] | null;
          
          console.log("Connection result (eth_requestAccounts):", accounts);
          safeSetAccount(accounts);
          
          if (accounts && accounts.length > 0) {
            return;
          }
        } catch (err) {
          console.error("MetaMask connection error:", err);
        }
      }

      // Fallback to SDK connect
      const connectedAccount = await sdk?.connect();
      console.log("SDK Connection result:", connectedAccount);
      
      // Safely set account
      if (typeof connectedAccount === 'string') {
        setCurrentAccount(connectedAccount);
      } else {
        setCurrentAccount(null);
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setCurrentAccount(null);
    }
  };

  const disconnect = async () => {
    try {
      // Attempt to terminate SDK connection
      await sdk?.terminate();
      
      // Reset account to null
      setCurrentAccount(null);
      
      console.log("Wallet disconnected");
    } catch (err) {
      console.error("Disconnection error:", err);
      setCurrentAccount(null);
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        account: currentAccount, 
        connected, 
        connect, 
        disconnect 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};