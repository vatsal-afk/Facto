"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

// Define interfaces for type safety
interface NewsArticle {
  title: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsApiResponse {
  status: string;
  articles?: NewsArticle[];
  message?: string;
}

// Define the event keywords, focusing on India and elections, especially in Maharashtra
const EVENT_KEYWORDS = ["India", "election", "Maharashtra", "2024", "polls"];

const fetchLiveContent = async (keywords: string[]): Promise<NewsArticle[]> => {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const query = keywords.join('+');
  const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&language=en&sortBy=publishedAt&pageSize=5`;

  try {
    const response = await fetch(url);
    const data: NewsApiResponse = await response.json();

    console.log("Fetched data:", data);

    if (data.status !== "ok") {
      console.error("Error fetching data:", data.message);
      return [];
    }

    return data.articles || [];
  } catch (error) {
    console.error("Error fetching live content:", error);
    return [];
  }
};

export default function LiveEventAnalysis() {
  const [liveData, setLiveData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const newData = await fetchLiveContent(EVENT_KEYWORDS);
        setLiveData(newData);
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-teal-500 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Elections in India</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading live data...</p>
        ) : (
          <ul className="space-y-4">
            {liveData.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">No new articles available.</p>
            ) : (
              liveData.map((article, index) => (
                <li key={`${article.title}-${index}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600 dark:text-gray-300">{article.title}</div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}