import DashboardWidgets from '@/components/dashboard-widgets'
import Graph from '@/components/widgets/graph'
import { WalletProvider } from './WalletContext'
import BreakingNewsBanner from '@/components/widgets/breaking-news-banner'

export default function Home() {
  return (
    <WalletProvider>
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800 dark:text-indigo-200">Fake News Analysis Dashboard</h1>
        <BreakingNewsBanner />
        <DashboardWidgets />
        <div className="mt-8">
          <Graph />
        </div>
      </main>
    </div>
    </WalletProvider>
  )
}

