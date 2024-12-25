import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'

export default function RelatedArticles({ id }: { id: string }) {
  const articles = [
    { title: "Related Article 1", url: "#" },
    { title: "Related Article 2", url: "#" },
    { title: "Related Article 3", url: "#" },
  ]

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Related Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {articles.map((article, index) => (
            <li key={index}>
              <a 
                href={article.url}
                className="flex items-center justify-between text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
              >
                <span>{article.title}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

