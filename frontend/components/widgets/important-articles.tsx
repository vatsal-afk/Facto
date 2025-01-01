"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function ImportantArticles() {
  const [articles, setArticles] = useState<any[]>([]);

  // Fetch articles when the component mounts
  useEffect(() => {
    const fetchArticles = async () => {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY; // Use your NewsAPI key
      const url = `https://newsapi.org/v2/everything?q=fake+news+OR+misinformation&apiKey=${apiKey}&language=en`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if the data contains articles
        if (data.status === "ok" && data.articles) {
          // Limit the articles to a maximum of 10
          setArticles(data.articles.slice(0, 10)); // Set the first 10 articles
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-indigo-500 text-white">
        <CardTitle className="text-lg font-semibold">Important Articles</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <ul className="space-y-4">
          {articles.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Loading articles...</p>
          ) : (
            articles.map((article, index) => (
              <li key={index}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
                >
                  <span>{article.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
