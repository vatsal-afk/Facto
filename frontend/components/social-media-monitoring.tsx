"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const initialData = [
  { platform: 'Twitter', misinformation: 4000, factualContent: 2400 },
  { platform: 'Facebook', misinformation: 3000, factualContent: 3500 },
  { platform: 'Instagram', misinformation: 2000, factualContent: 5000 },
  { platform: 'TikTok', misinformation: 2780, factualContent: 3908 },
  { platform: 'YouTube', misinformation: 1890, factualContent: 4800 },
]

export default function SocialMediaAnalysis() {
  const [data, setData] = useState(initialData)
  const [url, setUrl] = useState('')
  const [trendingTopics, setTrendingTopics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrendingAndRedditPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/trending-topics-by-reddit');
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

  const handleAnalyze = () => {
    // This is where you'd typically make an API call to analyze the URL
    console.log('Analyzing URL:', url)
    // For now, we'll just randomize the data
    const newData = data.map(item => ({
      ...item,
      misinformation: Math.floor(Math.random() * 5000),
      factualContent: Math.floor(Math.random() * 5000)
    }))
    setData(newData)
  }

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
    </div>
  )
}
