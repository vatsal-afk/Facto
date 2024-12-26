import { Card } from "@/components/ui/card"

interface SentimentPlotProps {
  score: number // -1 to 1
}

export function SentimentPlot({ score }: SentimentPlotProps) {
  const normalizedScore = (score + 1) / 2 // Convert -1...1 to 0...1
  const position = `${normalizedScore * 100}%`

  return (
    <div className="relative h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
      <div
        className="absolute top-0 w-4 h-8 bg-black rounded-full transform -translate-x-1/2"
        style={{ left: position }}
      />
      <div className="absolute top-10 left-0 w-full flex justify-between text-sm">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  )
}

