"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react'

const breakingNews = [
  "Major fact-checking initiative launched by tech giants",
  "New AI tool developed to combat deepfake videos",
  "Government announces stricter penalties for spreading misinformation",
  "Social media platforms implement new policies to curb fake news",
  "Global summit on digital literacy and misinformation prevention announced"
]

export default function BreakingNewsBanner() {
  const [newsText, setNewsText] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const news = breakingNews.join(" • ")
    setNewsText(news + " • " + news) // Duplicate the text to create a seamless loop

    const animate = () => {
      if (containerRef.current) {
        if (containerRef.current.scrollLeft >= containerRef.current.scrollWidth / 2) {
          containerRef.current.scrollLeft = 0
        } else {
          containerRef.current.scrollLeft += 1
        }
      }
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <Card className="bg-red-600 text-white mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="bg-red-700 p-4 flex-shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div 
            ref={containerRef}
            className="overflow-hidden whitespace-nowrap flex-1"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
          >
            <div className="py-4 px-6 inline-block">
              {newsText}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

