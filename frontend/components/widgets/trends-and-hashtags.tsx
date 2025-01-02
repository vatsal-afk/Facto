"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Helper function to generate random colors
const generateRandomColor = () => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-red-100 text-red-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const TrendsAndHashtags = () => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const response = await fetch(
          'https://api.allorigins.win/get?url=' + encodeURIComponent('https://trends.google.com/trends/hottrends/visualize/internal/data')
        );

        if (!response.ok) {
          throw new Error("Failed to fetch trending hashtags");
        }

        const data = await response.json();
        console.log("API Response Data:", data);  // Log the raw data to check the structure

        // Parse the content string to get the JSON data
        const trends = JSON.parse(data.contents);

        // Extract trending hashtags for the given country (e.g., india)
        if (trends?.india) {
          const trendingHashtags = trends.india.map(
            (item: string) => `#${item.replace(/\s+/g, '')}`
          );
          setHashtags(trendingHashtags);
        } else {
          setHashtags(["No trending hashtags available at the moment."]);
        }
      } catch (error) {
        console.error("Error fetching trends:", error);
        setError("Error fetching hashtags. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingHashtags();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-yellow-500 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Trends and Hashtags</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span>{error}</span>
          ) : hashtags.length > 0 ? (
            hashtags.map((hashtag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`${generateRandomColor()} hover:bg-opacity-80 cursor-pointer`}
              >
                {hashtag}
              </Badge>
            ))
          ) : (
            <span>No trending hashtags available at the moment.</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsAndHashtags;
