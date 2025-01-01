import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function Similarity({ similarity }: { similarity: number }) {
  const percentage = similarity * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similarity to Known Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="w-full" />
          <p className="text-sm text-muted-foreground">{percentage.toFixed(2)}% similar to verified sources</p>
        </div>
      </CardContent>
    </Card>
  )
}

