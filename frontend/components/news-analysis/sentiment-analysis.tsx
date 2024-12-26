import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface SentimentAnalysisProps {
  score: number // 0 (negative) or 1 (positive)
}

export function SentimentAnalysis({ score }: SentimentAnalysisProps) {
  const isPositive = score === 1

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={`flex items-center justify-center h-40 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
        {isPositive ? (
          <ThumbsUp className="w-24 h-24 text-green-600" />
        ) : (
          <ThumbsDown className="w-24 h-24 text-red-600" />
        )}
      </div>
      <div className="text-center mt-4">
        <span className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? 'Positive' : 'Negative'}
        </span>
        <p className="text-lg text-muted-foreground mt-1">Sentiment</p>
      </div>
    </div>
  )
}

