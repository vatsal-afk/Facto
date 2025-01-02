"use client";

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
          // Limit the articles to a maximum of 12
          setArticles(data.articles.slice(0, 12)); // Set the first 10 articles
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-purple-500 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Articles we recommend reading</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Loading articles...</p>
          ) : (
            articles.map((article, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                {/* Article Title and Link */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {article.title}
                  </a>
                </h3>
                {/* Article Description */}
                {article.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{article.description}</p>
                )}
                {/* Read More Arrow */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
                >
                  <span>Read more</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
