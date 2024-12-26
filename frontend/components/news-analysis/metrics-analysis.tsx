import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricsAnalysisProps {
  data: Array<{ metric: string; value: number }>
}

export function MetricsAnalysis({ data }: MetricsAnalysisProps) {
  const getBarColor = (value: number) => {
    if (value < 0.3) return "#ef4444" // red-500
    if (value < 0.7) return "#eab308" // yellow-500
    return "#22c55e" // green-500
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metrics Analysis</CardTitle>
        <CardDescription>Similarity Score, Lexical Diversity, and Fact Density</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="metric" />
            <YAxis domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-gray-300 rounded shadow">
                      <p className="font-semibold">{data.metric}</p>
                      <p className="text-sm">{`Value: ${data.value.toFixed(2)}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              fill="#3b82f6"
              shape={(props: any) => {
                const { x, y, width, height } = props;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={getBarColor(props.value)} rx={4} />
                    <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={12}>
                      {props.value.toFixed(2)}
                    </text>
                  </g>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

