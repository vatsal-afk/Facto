import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'

export default function ImportantArticles() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-indigo-500 text-white">
        <CardTitle className="text-lg font-semibold">Important Articles</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <ul className="space-y-4">
          <li>
            <a href="#" className="flex items-center justify-between text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200">
              <span>How to Spot Fake News: A Comprehensive Guide</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center justify-between text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200">
              <span>The Impact of Misinformation on Democracy</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center justify-between text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200">
              <span>Fact-Checking Tools Every Citizen Should Know</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

