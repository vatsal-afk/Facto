"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function SocialMediaAnalysis() {
  const [data, setData] = useState([])
  const [url, setUrl] = useState('')
  const [trendingTopics, setTrendingTopics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrendingAndRedditPosts = async () => {
      try {
        const response = await fetch('http://localhost:5001/trending-topics-by-reddit');
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        const data = await response.json();
        setTrendingTopics(data); // Store data in state
      } catch (err) {
        console.error(err);
        setError(err.message); // Store error in state
      }
    };

    fetchTrendingAndRedditPosts();
  }, []);

  // Fetch trending topics and Reddit posts
  useEffect(() => {
    const fetchTrendingAndRedditPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/trending-topics-by-reddit');
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        const data = await response.json();
        setTrendingTopics(data); // Store trending topics and Reddit posts
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrendingAndRedditPosts();
  }, []);

  // Handle analysis of the social media post URL
  const handleAnalyze = async () => {
    try {
      if (!url) {
        alert('Please enter a URL to analyze.');
        return;
      }

      console.log('Analyzing URL:', url);

      // Sending the URL to the backend for analysis
      const response = await fetch('http://localhost:5000/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze the URL.');
      }

      // The backend returns the data directly
      const analysisData = await response.json();
      setData(analysisData); // Update state with the backend analysis data

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Render Reddit posts before the Card */}
      {trendingTopics && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Trending Topics and Reddit Posts</h2>
          {Object.entries(trendingTopics.reddit_posts).map(([topic, posts]) => (
            <div key={topic} className="space-y-2">
              <h3 className="text-lg font-medium">{topic}</h3>
              <ul>
                {posts.map((post, index) => (
                  <li key={index} className="border-b pb-2">
                    <div className="flex items-center space-x-4">
                      {/* Render Thumbnail Image if available */}
                      {post.thumbnail && (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          {post.title}
                        </a>
                        <p className="text-sm text-gray-500">Score: {post.score}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
