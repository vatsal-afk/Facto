import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function FactDensity({ density }: { density: number }) {
  const percentage = density * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fact Density</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="w-full" />
          <p className="text-sm text-muted-foreground">{percentage.toFixed(2)}% of content is factual</p>
        </div>
      </CardContent>
    </Card>
  )
}

