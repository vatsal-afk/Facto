"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface RedditPost {
  title: string;
  url: string;
  thumbnail: string;
  score: number;
}

interface TrendingTopics {
  reddit_posts: {
    [key: string]: RedditPost[];
  };
}

interface MisinformationData {
  platform: string;
  misinformation: number;
  factualContent: number;
}

export default function SocialMediaAnalysis() {
  const [data, setData] = useState<MisinformationData[]>([]);
  const [url, setUrl] = useState<string>('');
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingAndRedditPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/trending-topics-by-reddit');
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        const data = await response.json();
        setTrendingTopics(data); // Store data in state
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchTrendingAndRedditPosts();
  }, []);

  const handleAnalyze = async () => {
    try {
      if (!url) {
        alert('Please enter a URL to analyze.');
        return;
      }

      console.log('Analyzing URL:', url);

      const response = await fetch('http://localhost:5000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url:url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze the URL.');
      }

      const analysisData = await response.json();
      setData(analysisData.results.scores); // Assuming `results.scores` contains the data for the chart

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Render Trending Topics and Reddit Posts as Cards */}
      {trendingTopics && (
        <div className="space-y-4">
          <h1 className="text-xl font-semibold text-center">Dive into Reddit Posts</h1>
          {Object.entries(trendingTopics.reddit_posts).map(([topic, posts]) => (
            <div key={topic} className="space-y-4">
              <h3 className="text-lg font-medium">{topic}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <Card key={index} className="border p-4 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Render Thumbnail Image if available */}
                        {post.thumbnail && (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-40 object-cover rounded-md"
                          />
                        )}
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Read more
                        </a>
                        <p className="text-sm text-gray-500">Score: {post.score}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Social Media Post URL Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle>Analyze Social Media Post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="url"
              placeholder="Enter social media post URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleAnalyze}>Analyze</Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Misinformation Analysis Chart */}
      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Social Media Misinformation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="misinformation" fill="#8884d8" />
                <Bar dataKey="factualContent" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
