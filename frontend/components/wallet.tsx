"use client";

import Link from "next/link";

import WalletIcon from "../public/WalletIcon";

import { Button } from "./ui/button";

import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import { formatAddress } from "../lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = async () => {
    if (sdk) {
      try {
        await sdk.terminate();
        console.log("Disconnected");
      } catch (error) {
        console.error("Error while disconnecting:", error);
      }
    } else {
      console.warn("SDK is not available");
    }
  };

  return (
    <div className="relative">
      {connected ? (
        <Popover>
          <PopoverTrigger>
            <Button>{formatAddress(account)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <div
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      )}
    </div>
  );
};

export const WalletComponent = () => {
    const host =
      typeof window !== "undefined" ? window.location.host : "defaultHost";
  
    const sdkOptions = {
      logging: { developerMode: false },
      checkInstallationImmediately: false,
      dappMetadata: {
        name: "Next-Metamask-Boilerplate",
        url: host, // using the host constant defined above
      },
    };
  
    return (
      <nav className="flex items-center justify-between max-w-screen-xl px-6 mx-auto py-7 rounded-xl">
        <Link href="/" className="flex gap-1 px-6">
          <span className="hidden text-2xl font-bold sm:block">
            <span className="text-gray-900"></span>
          </span>
        </Link>
        <div className="flex gap-4 px-6">
          <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
            <ConnectWalletButton />
          </MetaMaskProvider>
        </div>
      </nav>
    );
  };
  
  export default WalletComponent;