"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { useWallet } from "@/app/WalletContext";
import WalletIcon from "@/public/WalletIcon";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { connected, account, connect, disconnect } = useWallet();
  const [showFullAccount, setShowFullAccount] = useState(false);

  useEffect(() => {
    // Debugging wallet details
    // console.log("Wallet Details in Header:", { connected, account });
  }, [connected, account]);

  const toggleAccountDisplay = () => {
    setShowFullAccount((prev) => !prev);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account || "");
    alert("Account address copied to clipboard!");
  };

  return (
    <header className="bg-[#112023] shadow-md py-4 px-6 flex justify-between items-center">
      <div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wide">
          Facto
        </h1>
        <p className="text-lg md:text-xl text-yellow-400 font-medium">
          Empowering Truth
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700"
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5 text-white" />
          ) : (
            <MoonIcon className="h-5 w-5 text-white" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {connected ? (
          <div className="flex items-center space-x-2">
            {/* Wallet Address */}
            <span
              className={`px-2 py-1 text-sm rounded-md cursor-pointer ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={toggleAccountDisplay}
              title="Click to toggle full address"
            >
              {account
                ? showFullAccount
                  ? account
                  : `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Loading..."}
            </span>

            {/* Copy Address Button */}
            {account && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="px-3"
              >
                Copy Address
              </Button>
            )}

            {/* Disconnect Button */}
            <Button
              onClick={disconnect}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <WalletIcon className="h-5 w-5" />
              <span>Disconnect</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={connect}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <WalletIcon className="h-5 w-5" />
            <span>Connect Wallet</span>
          </Button>
        )}
      </div>
    </header>
  );
}
