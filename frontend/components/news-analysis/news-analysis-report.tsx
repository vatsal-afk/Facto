"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SentimentAnalysis } from "./sentiment-analysis"
import { ReadabilityScore } from "./readability-score"
import { MetricsAnalysis } from "./metrics-analysis"
import { KnowledgeGraph } from "./knowledge-graph"
import { CheckCircle2, XCircle } from 'lucide-react'

// Placeholder data - replace with actual data from your backend
const metricsData = [
  { metric: "Similarity Score", value: 0.7 },
  { metric: "Lexical Diversity", value: 0.8 },
  { metric: "Fact Density", value: 0.6 },
]

const sentimentScore = 1 // 0 for negative, 1 for positive
const readabilityScore = 75 // 0 to 100

// Placeholder data for knowledge graph
const graphData = {
  nodes: [
    { id: "Article", group: 1 },
    { id: "Topic A", group: 2 },
    { id: "Topic B", group: 2 },
    { id: "Topic C", group: 2 },
    { id: "Fact 1", group: 3 },
    { id: "Fact 2", group: 3 },
    { id: "Fact 3", group: 3 },
  ],
  links: [
    { source: "Article", target: "Topic A", value: 1 },
    { source: "Article", target: "Topic B", value: 1 },
    { source: "Article", target: "Topic C", value: 1 },
    { source: "Topic A", target: "Fact 1", value: 1 },
    { source: "Topic B", target: "Fact 2", value: 1 },
    { source: "Topic C", target: "Fact 3", value: 1 },
  ]
}

export function NewsAnalysisReport() {
  const isRealNews = Math.random() > 0.5 // Replace with actual logic

  return (
    <div className="space-y-8">
      <Card className={`bg-gradient-to-r ${isRealNews ? 'from-green-100 to-green-200' : 'from-red-100 to-red-200'}`}>
        <CardHeader>
          <CardTitle className="text-center text-3xl">Verdict</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            {isRealNews ? (
              <CheckCircle2 className="w-24 h-24 text-green-600 mb-4" />
            ) : (
              <XCircle className="w-24 h-24 text-red-600 mb-4" />
            )}
            <p className="text-4xl font-bold mb-2">
              {isRealNews ? "Real News" : "Fake News"}
            </p>
            <p className="text-center text-muted-foreground">
              Based on our comprehensive analysis, this article is classified as shown above.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MetricsAnalysis data={metricsData} />
        <Card>
          <CardHeader>
            <CardTitle>Readability Score</CardTitle>
            <CardDescription>Higher scores indicate better readability</CardDescription>
          </CardHeader>
          <CardContent>
            <ReadabilityScore score={readabilityScore} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>Overall sentiment of the article</CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentAnalysis score={sentimentScore} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Graph</CardTitle>
            <CardDescription>Connections between topics and facts in the article</CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeGraph nodes={graphData.nodes} links={graphData.links} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

