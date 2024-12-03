import DashboardWidgets from '@/components/dashboard-widgets'
import TrendAnalysis from '@/components/trend-analysis'
import LiveBroadcastAnalysis from '@/components/live-broadcast-analysis'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardWidgets />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <TrendAnalysis />
        <LiveBroadcastAnalysis />
      </div>
    </div>
  )
}

