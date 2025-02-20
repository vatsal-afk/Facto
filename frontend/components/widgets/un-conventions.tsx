"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UNConventions: React.FC = () => {
  const [newsEntries, setNewsEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bills/get_un_news`); // Adjust URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch UN news.");
        }
        const data = await response.json();

        if (Array.isArray(data.news_entries)) {
          setNewsEntries(data.news_entries.slice(0, 3)); // Limit to 2–3 entries
        } else {
          setError("Invalid data format received.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-green-500 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">United Nations</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        {loading && <p>Loading news...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ul className="space-y-4">
            {newsEntries.length === 0 ? (
              <p>No news entries found.</p>
            ) : (
              newsEntries.map((entry, index) => (
                <li key={index} className="flex flex-col space-y-1 border-b pb-2">
                  <span className="font-semibold text-blue-700 hover:underline">
                    <a
                      href={entry.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entry.Title}
                    </a>
                  </span>
                  <span className="text-sm text-gray-500">{entry.Published}</span>
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    {entry.Status || "Update"}
                  </Badge>
                </li>
              ))
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default UNConventions;
