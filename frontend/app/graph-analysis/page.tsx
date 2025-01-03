import NewsHeader from '@/components/news-analysis/news-header'
import { NewsAnalysisReport } from "@/components/news-analysis/news-analysis-report"


export default function NewsAnalysisPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <NewsHeader id={params.id} /> */}
      <div className="container mx-auto px-4 py-8">
        <NewsAnalysisReport />
      </div>
    </div>
  )
}

