// DO NOT MODIFY THIS AS THIS CONTAINS CODE FOR THE GRAPH ELEMENT

// "use client"

// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// const data = [
//   { name: 'Jan', misinformation: 4000, factualNews: 2400 },
//   { name: 'Feb', misinformation: 3000, factualNews: 1398 },
//   { name: 'Mar', misinformation: 2000, factualNews: 9800 },
//   { name: 'Apr', misinformation: 2780, factualNews: 3908 },
//   { name: 'May', misinformation: 1890, factualNews: 4800 },
//   { name: 'Jun', misinformation: 2390, factualNews: 3800 },
// ]

// function TrendAnalysis() {
//   return (
//     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-4">Trend Analysis</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="misinformation" stroke="#8884d8" />
//           <Line type="monotone" dataKey="factualNews" stroke="#82ca9d" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

"use client"


import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewsItem } from "./NewsItem"; 
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;

const sections = [
  { title: "Featured News", category: "featured" },
  { title: "Latest News", category: "latest" },
  { title: "Politics", category: "politics" },
  { title: "Entertainment", category: "entertainment" },
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
          url.searchParams.append("show-fields", "trailText");
          url.searchParams.append("page-size", "3");

          const response = await fetch(url.toString());
          const data = await response.json();

          return {
            category: section.category,
            articles: data.response.results.map((article: any) => ({
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
  }, []);

  const filteredNews = (category: string) => {
    const categoryNews = newsData[category] || [];
    return searchTerm
      ? categoryNews.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : categoryNews;
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
