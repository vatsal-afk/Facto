// app/layout.tsx
import { Inter } from 'next/font/google'
import Providers from "./providers"
import './globals.css'
import Header from '@/components/header'
import AppSidebar from '@/components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Misinformation Detection System',
  description: 'Real-Time Misinformation Detection and Verification System for Broadcast Media',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen w-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}