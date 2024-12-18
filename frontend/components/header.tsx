"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { useWallet } from '@/app/WalletContext'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { connected, account, connect, disconnect } = useWallet()
  useEffect(() => {
    console.log("Wallet Details in Header:", { 
      connected, 
      account, 
      accountType: typeof account 
    });
  }, [connected, account]);
  console.log("Wallet account:", account)
  console.log("Wallet connected:", connected)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Misinformation Detection System</h1>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button>Sign in</Button>
        {connected ? (
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-300">
              {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Loading..."}
            </span>
            <Button onClick={disconnect}>Disconnect</Button>
          </div>
        ) : (
          <Button onClick={connect}>Connect Wallet</Button>
        )}
      </div>
    </header>
  )
}
