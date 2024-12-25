import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewsHeader({ id }: { id: string }) {
  // In a real application, you'd fetch the news details based on the id
  const newsTitle = "Example News Title"
  const newsSource = "Example News Source"
  const newsDate = "2023-06-15"

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{newsTitle}</CardTitle>
        <CardDescription>{newsSource} • {newsDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300">
          This is a brief summary of the news article. It provides context for the analysis below.
        </p>
      </CardContent>
    </Card>
  )
}

