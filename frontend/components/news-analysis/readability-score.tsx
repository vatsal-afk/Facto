import { Card, CardContent } from "@/components/ui/card"

interface ReadabilityScoreProps {
  score: number // 0 to 100
}

export function ReadabilityScore({ score }: ReadabilityScoreProps) {
  const getColorClass = (score: number) => {
    if (score < 30) return "text-red-500"
    if (score < 70) return "text-yellow-500"
    return "text-green-500"
  }

  const getLabel = (score: number) => {
    if (score < 30) return "Difficult"
    if (score < 70) return "Moderate"
    return "Easy"
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-48">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <div className={`text-5xl font-bold ${getColorClass(score)}`}>{score}</div>
          </div>
        </div>
        <svg className="w-full h-full" viewBox="0 0 100 50">
          <path
            d="M 50 50 A 40 40 0 0 1 100 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <path
            d="M 50 50 A 40 40 0 0 1 100 50"
            fill="none"
            stroke={getColorClass(score).replace('text-', 'stroke-')}
            strokeWidth="10"
            strokeDasharray={`${score * 1.57} 157`}
          />
        </svg>
      </div>
      <div className="text-center mt-4">
        <span className={`text-2xl font-semibold ${getColorClass(score)}`}>{getLabel(score)}</span>
        <p className="text-sm text-muted-foreground mt-1">Readability Level</p>
      </div>
    </div>
  )
}

