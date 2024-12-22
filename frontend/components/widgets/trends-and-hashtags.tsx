import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TrendsAndHashtags() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-yellow-500 text-white">
        <CardTitle className="text-lg font-semibold">Trends and Hashtags</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">#FactCheck</Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer">#TruthMatters</Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer">#StopFakeNews</Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer">#MediaLiteracy</Badge>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer">#DigitalCitizenship</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

