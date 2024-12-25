import { Suspense } from 'react'
import NewsHeader from '@/components/news-analysis/news-header'
import AnalysisStats from '@/components/news-analysis/analysis-stats'
import KnowledgeGraph from '@/components/news-analysis/knowledge-graph'
import RelatedArticles from '@/components/news-analysis/related-articles'
import SentimentAnalysis from '@/components/news-analysis/sentiment-analysis'
import SourceReliability from '@/components/news-analysis/source-reliability'

export default function NewsAnalysisPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <NewsHeader id={params.id} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Suspense fallback={<div>Loading stats...</div>}>
          <AnalysisStats id={params.id} />
        </Suspense>
        <Suspense fallback={<div>Loading sentiment analysis...</div>}>
          <SentimentAnalysis id={params.id} />
        </Suspense>
      </div>
      <div className="mt-8">
        <Suspense fallback={<div>Loading knowledge graph...</div>}>
          <KnowledgeGraph id={params.id} />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Suspense fallback={<div>Loading source reliability...</div>}>
          <SourceReliability id={params.id} />
        </Suspense>
        <Suspense fallback={<div>Loading related articles...</div>}>
          <RelatedArticles id={params.id} />
        </Suspense>
      </div>
    </div>
  )
}

