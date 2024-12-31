"use client"

import React, { useState, useEffect } from "react";

const UNNews: React.FC = () => {
  const [newsEntries, setNewsEntries] = useState<any[]>([]);  // Ensure it's an empty array initially
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_un_news");
        if (!response.ok) {
          throw new Error("Failed to fetch news.");
        }
        const data = await response.json();
        
        // Ensure data.news is an array
        if (Array.isArray(data.news)) {
          setNewsEntries(data.news);  // Access the 'news' property
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">UN News</h1>

      {loading && <p>Loading news...</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {newsEntries.length === 0 ? (
          <p>No news entries found.</p>
        ) : (
          newsEntries.map((entry, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{entry.Title}</h2>
              <p className="text-gray-600">{entry.Published}</p>
              <p>{entry.Summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UNNews;