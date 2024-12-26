import { Card, CardContent } from "@/components/ui/card"

interface ReadabilityGaugeProps {
  score: number // 0 to 100
}

export function ReadabilityGauge({ score }: ReadabilityGaugeProps) {
  const rotation = (score / 100) * 180 - 90 // -90 to 90 degrees

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <div className="overflow-hidden h-40">
        <div className="w-full h-80 rounded-full bg-gradient-to-b from-red-500 via-yellow-500 to-green-500" />
      </div>
      <div 
        className="absolute top-32 left-1/2 w-1 h-20 bg-black origin-top"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      />
      <div className="absolute top-36 left-0 w-full flex justify-between text-sm">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
      <div className="text-center mt-4 text-2xl font-bold">{score}</div>
    </div>
  )
}

