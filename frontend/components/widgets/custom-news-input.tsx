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
      const response=await fetch("http://127.0.0.1:8000/scrape",{
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

      //console.log('Navigating to:', /graph-analysis?${queryParams})
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
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="bg-pink-500 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Got something to Verify? Input here:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        <h2 className="text-xl font-semibold bg-gray-200 p-4 rounded-md">Enter text description / Article text</h2>
        <form onSubmit={handleNewsSubmit} className="space-y-4">
          <Textarea
            placeholder="News Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button type="submit" className="mx-auto block">Submit News</Button>
        </form>

        <h2 className="text-xl font-semibold bg-gray-200 p-4 rounded-md">Submit a Link to an Article...</h2>
        <form onSubmit={handleLinkSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Article Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <Button type="submit" className="mx-auto block">Submit a Link</Button>
        </form>

        {/* <h2 className="text-xl font-semibold bg-gray-200 p-4 rounded-md">Got a File? no worries.</h2>
        <form onSubmit={handleFileSubmit} className="space-y-4">
          <Input type="file" name="file" />
          <Button type="submit" className="mx-auto block">Submit File</Button>
        </form> */}
      </CardContent>
    </Card>
  )
}
