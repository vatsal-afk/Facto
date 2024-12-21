import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function UNConventions() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-green-500 text-white">
        <CardTitle className="text-lg font-semibold">UN Conventions</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <span>Convention on Cybercrime</span>
            <Badge variant="outline" className="bg-purple-100 text-purple-800">Ongoing</Badge>
          </li>
          <li className="flex items-center justify-between">
            <span>AI Ethics Guidelines</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">Proposed</Badge>
          </li>
          <li className="flex items-center justify-between">
            <span>Digital Rights Declaration</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">Adopted</Badge>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

