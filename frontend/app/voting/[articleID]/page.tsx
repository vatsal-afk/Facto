"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Voting from '@/components/voting'

export default function VotingPage() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      // In a real application, you would fetch the article data from your API or database
      // For this example, we'll just use mock data
      const mockArticle = {
        id: params.articleId,
        title: "Sample Article Title",
        content: "This is a sample article content.",
        // Add other relevant fields
      }
      setArticle(mockArticle)
    }

    fetchArticle()
  }, [params.articleId])

  if (!article) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vote on Article</h1>
      <h2 className="text-2xl font-semibold mb-4">{article.title}</h2>
      <p className="mb-6">{article.content}</p>
      <Voting articleId={article.id} />
    </div>
  )
}

