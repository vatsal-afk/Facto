"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Comment = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "This article seems to contain some misleading information. Has anyone fact-checked the claims?",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    author: "Bob Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "I've cross-referenced the data with reputable sources, and it appears to be accurate. Here are some links for verification...",
    timestamp: "1 hour ago"
  }
]

export default function Discussions() {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')

  const handleSubmitComment = () => {
    if (newComment.trim() === '') return

    const comment: Comment = {
      id: comments.length + 1,
      author: "Current User",
      avatar: "/placeholder.svg?height=40&width=40",
      content: newComment,
      timestamp: "Just now"
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add to the Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your thoughts or findings..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleSubmitComment}>Post Comment</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discussion Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <Avatar>
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{comment.author}</div>
                  <div className="text-sm text-gray-500">{comment.timestamp}</div>
                  <div className="mt-1">{comment.content}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

