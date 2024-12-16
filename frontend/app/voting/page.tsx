import Voting from '@/components/voting'

export default function VotingPage({ params }: { params: { articleId: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vote on Article</h1>
      <Voting articleId={params.articleId} />
    </div>
  )
}