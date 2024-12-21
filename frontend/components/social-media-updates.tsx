import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Twitter, Facebook } from 'lucide-react'

export default function SocialMediaUpdates() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-purple-500 text-white">
        <CardTitle className="text-lg font-semibold">Social Media Updates</CardTitle>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <Twitter className="h-6 w-6 text-blue-500" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">Twitter</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Trending hashtag: #FactCheckThis</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
          <Facebook className="h-6 w-6 text-indigo-500" />
          <div>
            <p className="font-semibold text-indigo-800 dark:text-indigo-200">Facebook</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Viral post debunked: "5G causes..."</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

