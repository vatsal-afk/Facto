import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface KnowledgeGraphProps {
  graphUrl?: string;
}

export function KnowledgeGraph({ graphUrl }: KnowledgeGraphProps) {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Knowledge Graph</CardTitle>
      </CardHeader>
      <div className="flex justify-center items-center h-64">
        {graphUrl ? (
          <Image 
            src={graphUrl}
            alt="Knowledge Graph"
            width={800}
            height={600}
            className="w-full h-full object-contain"
            priority
          />
        ) : (
          <p className="text-center text-gray-500">No Knowledge Graph Available</p>
        )}
      </div>
    </Card>
  )
}

export default KnowledgeGraph