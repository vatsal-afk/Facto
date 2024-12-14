"use client"

import { useState } from 'react'
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

