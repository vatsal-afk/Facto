"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewsItem } from "@/components/news-item";

// Replace this with your actual Guardian API key
const GUARDIAN_API_KEY = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;

const sections = [
  { title: "World News", category: "world" },
  { title: "Latest News", category: "news" },
  { title: "Politics", category: "politics" },
  { title: "Sports", category: "sport" },
  { title: "Science & Technology", category: "technology" },
];

const TrendAnalysis: React.FC = () => {
  const [newsData, setNewsData] = useState<Record<string, any[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const newsPromises = sections.map(async (section) => {
          const url = new URL("https://content.guardianapis.com/search");
          url.searchParams.append("api-key", GUARDIAN_API_KEY || "");
          url.searchParams.append("section", section.category);
          url.searchParams.append("show-fields", "thumbnail,trailText");
          url.searchParams.append("page-size", "3");

          const response = await fetch(url.toString());
          const data = await response.json();

          return {
            category: section.category,
            articles: data.response.results.map((article: any) => ({
              articleId: article.id,
              title: article.webTitle,
              image: article.fields?.thumbnail || "/placeholder.svg?height=200&width=300",
              description: article.fields?.trailText || "No description available",
              link: article.webUrl,
            })),
          };
        });

        const newsResults = await Promise.all(newsPromises);

        const newsMap = Object.fromEntries(
          newsResults.map((result) => [result.category, result.articles])
        );
        setNewsData(newsMap);
      } catch (err) {
        setError("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []); // Empty dependency array to ensure it runs once

  const filteredNews = (category: string) => {
    const categoryNews = newsData[category] || [];
    return searchTerm
      ? categoryNews.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : categoryNews;
  };

  const handleVote = async (articleId: string, index: number) => {
    if (!articleId || index === undefined) {
      console.error("Article ID or index is missing!");
      return;
    }

    // try {
    //   const response = await fetch("/api/id", {  // Adjusted to match your endpoint
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ articleId, index }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to save vote");
    //   }

    //   console.log("Vote saved successfully!");
    // } catch (error) {
    //   console.error("Error saving vote:", error);
    // }
  };

  if (loading) return <div>Loading news...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto"
        />
      </div>

      {sections.map((section) => (
        <section key={section.category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {filteredNews(section.category).map((newsItem, index) => (
              <NewsItem
                key={`${section.category}-${index}`}
                title={newsItem.title}
                image={newsItem.image}
                description={newsItem.description}
                link={newsItem.link}
                articleId={newsItem.articleId}
                index={index}
                handleVoteClick={() => handleVote(newsItem.articleId, index)} // Pass down the vote handler
              />
            ))}
          </div>
          {filteredNews(section.category).length === 0 && (
            <p className="text-center text-gray-500">No news available in this category</p>
          )}
          <div className="text-center">
            <Button variant="outline">Show All {section.title}</Button>
          </div>
        </section>
      ))}
    </div>
  );
};

export default TrendAnalysis;
