"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CustomNewsInput() {
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const requestBody = { news_text: content }
    console.log('Sending to server:', requestBody)

    try {
      const response = await fetch('http://127.0.0.1:8000/verify_news', {
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

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting link:', { link })
    const requestBody = { url: link }

    try{
      const response=await fetch("http://127.0.0.1:5000/scrape",{
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

    }catch(error){
      console.error('Error:', error)
    }
  }

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting file')
  }

  return (
    <div className="space-y-6">
      {/* News Input Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="bg-pink-500 text-white rounded-t-md">
          <CardTitle className="text-lg font-semibold">Got something to Verify? Input here:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4">
          <form onSubmit={handleNewsSubmit} className="space-y-4">
            <Textarea
              placeholder="News Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Button type="submit">Submit News</Button>
          </form>
        </CardContent>
      </Card>

      {/* Link Submission Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="bg-pink-500 text-white rounded-t-md">
          <CardTitle className="text-lg font-semibold">Submit a Link to an Article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4">
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
        </CardContent>
      </Card>

      {/* File Upload Card */}
      {/* <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="bg-pink-500 text-white rounded-t-md">
          <CardTitle className="text-lg font-semibold">Got a File? No Worries.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4">
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <Input type="file" name="file" />
            <Button type="submit">Submit File</Button>
          </form>
        </CardContent>
      </Card> */}
    </div>
  )
}
