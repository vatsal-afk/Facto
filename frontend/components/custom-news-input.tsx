"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CustomNewsInput() {
  //const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://127.0.0.1:5000/detect_fake_news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ news_text: content }),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  
    //console.log('Submitting news:', { title, content })
    console.log('Submitting news:', { content })
  }

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement link submission logic
    console.log('Submitting link:', { link })
  }

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement link submission logic
    console.log('Submitting file')
  }

  return (
    <div className="space-y-6">
      <h1>Enter details:</h1>
      <form onSubmit={handleNewsSubmit} className="space-y-4">
        {/* <Input
          type="text"
          placeholder="News Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /> */}
        <Textarea
          placeholder="News Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit">Submit News</Button>
      </form>
      <h1>Submit a link:</h1>
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
      <h1>Upload a file:</h1>
      <form onSubmit={handleFileSubmit} className="space-y-4">
        <Input 
          type="file" 
          name="file" 
        />
        <Button type="submit">Submit File</Button>
      </form>
    </div>
  )
}

