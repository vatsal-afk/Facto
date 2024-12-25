"use client"

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ForceGraph2D } from 'react-force-graph'

const data = {
  nodes: [
    { id: "News Article", group: 1 },
    { id: "Person A", group: 2 },
    { id: "Person B", group: 2 },
    { id: "Event X", group: 3 },
    { id: "Organization Y", group: 4 },
    { id: "Location Z", group: 5 },
  ],
  links: [
    { source: "News Article", target: "Person A" },
    { source: "News Article", target: "Person B" },
    { source: "News Article", target: "Event X" },
    { source: "Person A", target: "Organization Y" },
    { source: "Person B", target: "Location Z" },
    { source: "Event X", target: "Location Z" },
  ]
}

export default function KnowledgeGraph({ id }: { id: string }) {
  const graphRef = useRef<any>()

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-100)
      graphRef.current.d3Force('link').distance(70)
    }
  }, [])

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Knowledge Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '500px' }}>
          <ForceGraph2D
            ref={graphRef}
            graphData={data}
            nodeAutoColorBy="group"
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id as string
              const fontSize = 12/globalScale
              ctx.font = `${fontSize}px Sans-Serif`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillStyle = node.color as string
              ctx.fillText(label, node.x as number, node.y as number)
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color
              const size = 10
              ctx.fillRect((node.x as number) - size/2, (node.y as number) - size/2, size, size)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

