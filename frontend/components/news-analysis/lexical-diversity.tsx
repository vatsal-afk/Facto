import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function LexicalDiversity({ diversity }: { diversity: number }) {
  const percentage = diversity * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lexical Diversity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="w-full" />
          <p className="text-sm text-muted-foreground">Diversity score: {diversity.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

