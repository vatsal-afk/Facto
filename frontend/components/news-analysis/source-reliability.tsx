"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SourceReliability({ id }: { id: string }) {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Source Reliability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Factual Reporting</span>
            <span className="text-sm font-medium">75%</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Editorial Independence</span>
            <span className="text-sm font-medium">80%</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Transparency</span>
            <span className="text-sm font-medium">90%</span>
          </div>
          <Progress value={90} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

