"use client";

import React, { useState, useEffect } from "react";

const UNNews: React.FC = () => {
  const [newsEntries, setNewsEntries] = useState<any[]>([]); // Ensure it's an empty array initially
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

        // Access the correct property
        if (Array.isArray(data.news_entries)) {
          setNewsEntries(data.news_entries); // Access the 'news_entries' property
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
      {/* <h1 className="text-2xl font-semibold mb-4 text-center">United Nations News</h1> */}

      {loading && <p>Loading news...</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {newsEntries.length === 0 ? (
          <p></p> // No data found
        ) : (
          newsEntries.map((entry, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{entry.Title}</h2>
              <p className="text-gray-600">{entry.Published}</p>
              <p>{entry.Summary}</p>
              <a
                href={entry.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Read more
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UNNews;
