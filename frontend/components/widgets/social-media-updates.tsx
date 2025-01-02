"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Twitter, Facebook, Instagram } from "lucide-react";

// Simulate fetching general social media updates (You can replace this with real APIs)
const fetchSocialMediaUpdates = async () => {
  // This can be an API call to get dynamic updates based on trending or viral posts from each platform
  return [
    { platform: "Twitter", content: "#TechTrends are dominating today with new innovations.", link: "https://twitter.com/hashtag/TechTrends" },
    { platform: "Facebook", content: "This viral post explains how AI will shape our future!", link: "https://facebook.com/ai-future-post" },
    { platform: "Instagram", content: "New travel destinations for 2025 are trending right now!", link: "https://instagram.com/p/travel2025" },
  ];
};

export default function SocialMediaUpdates() {
  const [socialMediaUpdates, setSocialMediaUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchSocialMediaUpdates();
      setSocialMediaUpdates(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-indigo-500 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Social Media Updates</CardTitle>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading updates...</p>
        ) : (
          socialMediaUpdates.map((update, index) => (
            <div
              key={index}
              className="flex flex-col items-start space-y-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg"
            >
              {/* Dynamic Social Media Card */}
              <div className="flex items-center space-x-4">
                {update.platform === "Twitter" && (
                  <Twitter className="h-6 w-6 text-blue-500" />
                )}
                {update.platform === "Facebook" && (
                  <Facebook className="h-6 w-6 text-indigo-500" />
                )}
                {update.platform === "Instagram" && (
                  <Instagram className="h-6 w-6 text-pink-500" />
                )}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {update.platform}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{update.content}</p>
                </div>
              </div>
              <a
                href={update.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
              >
                View Post
              </a>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
