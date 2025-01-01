"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function DashboardCard() {
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const requestBody = { news_text: content }
    console.log('Sending to server:', requestBody)

    try {
      const response = await fetch('http://127.0.0.1:5000/verify_news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log('Received from server:', result)

      const queryParams = new URLSearchParams({
        data: JSON.stringify(result),
      }).toString()

      console.log('Navigating to:', `/graph-analysis?${queryParams}`)
      window.location.href = `/graph-analysis?${queryParams}`
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting link:', { link })
  }

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting file')
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="bg-blue-500 text-white">
        <CardTitle className="text-lg font-semibold">Input News to verify!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        <h2 className="text-xl font-semibold">Enter News Details</h2>
        <form onSubmit={handleNewsSubmit} className="space-y-4">
          <Textarea
            placeholder="News Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button type="submit">Submit News</Button>
        </form>

        <h2 className="text-xl font-semibold">Submit a Link</h2>
        <form onSubmit={handleLinkSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Article Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <Button type="submit">Submit a Link</Button>
        </form>

        <h2 className="text-xl font-semibold">Upload a File</h2>
        <form onSubmit={handleFileSubmit} className="space-y-4">
          <Input type="file" name="file" />
          <Button type="submit">Submit File</Button>
        </form>
      </CardContent>
    </Card>
  )
}
