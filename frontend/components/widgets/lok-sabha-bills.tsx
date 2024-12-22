import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LokSabhaBills() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-blue-500 text-white">
        <CardTitle className="text-lg font-semibold">Latest Lok Sabha Bills</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <span>Personal Data Protection Bill</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>
          </li>
          <li className="flex items-center justify-between">
            <span>Digital India Act</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">In Progress</Badge>
          </li>
          <li className="flex items-center justify-between">
            <span>Cryptocurrency Regulation Bill</span>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

