'use client'

import { useSearchParams } from 'next/navigation'
import Voting from '@/components/voting'
import { useWallet } from '../WalletContext'

export default function VotingPage() {
  const searchParams = useSearchParams()
  const articleId = searchParams.get('articleId')
  const title = searchParams.get('title')
  const description = searchParams.get('description')

  const { account, connected, connect, disconnect } = useWallet();

  console.log(account);
  console.log(connected);

  // Ensure values are available before rendering
  if (!articleId || !title || !description) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vote on Article</h1>
      <Voting articleId={articleId} title={title} description={description} account={account} connected={connected}/>
    </div>
  )
}
