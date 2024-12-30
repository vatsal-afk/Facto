  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

  interface AnalysisData {
    avg_fact_density: number;
    avg_lexical_diversity: number;
    avg_readability: number;
    avg_sentiment: number;
    max_similarity: number;
    verdict: string;
  }

  export function KnowledgeGraph({ graphUrl}: KnowledgeGraphProps) {

    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Knowledge Graph</CardTitle>
        </CardHeader>
        <div className="flex justify-center items-center h-64">
        {graphUrl ? (
          <img
            src={graphUrl}
            alt="Knowledge Graph"
            className="w-full h-full object-contain max-w-100% max-h-100%"
          />
        ) : (
          <p className="text-center text-gray-500">No Knowledge Graph Available</p>
        )}
      </div>
      </Card>
    )
  }

