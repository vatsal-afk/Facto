import Legislature from '@/components/legislature'

export default function BillsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Recent Legislative Bills</h1>
      <Legislature />
    </div>
  )
}

