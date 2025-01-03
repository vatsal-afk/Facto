'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import usePushNotifications from "./notifications"

interface LiveStream {
  title: string
  url: string
  videoId: string
}

interface YouTubeResponseItem {
  snippet: {
    title: string
  }
  id: {
    videoId: string
  }
}

interface NewsVerdict {
  Verdict: string
  "Max Similarity": string
}

interface ProcessResponse {
  [key: string]: NewsVerdict
  error?: string
}

interface LiveNewsProps {
  setLiveNewsStreams: React.Dispatch<React.SetStateAction<LiveStream[]>>
}

const LiveNews: React.FC<LiveNewsProps> = ({ setLiveNewsStreams }) => {
  useEffect(() => {
    const fetchLiveNews = async () => {
      const YouTube_API_Key = "AIzaSyCXZVLg48y855cUljUqco5OIwpqOy2W_hA"
      if (!YouTube_API_Key) {
        console.error("YouTube API key is not configured")
        return
      }

      try {
        const response = await axios.get<{ items: YouTubeResponseItem[] }>("https://www.googleapis.com/youtube/v3/search", {
          params: {
            part: "snippet",
            eventType: "live",
            type: "video",
            q: "news english",
            key: YouTube_API_Key,
            maxResults: 6
          },
        })
        const liveStreams = response.data.items.map((item: YouTubeResponseItem) => ({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          videoId: item.id.videoId,
        }))
        setLiveNewsStreams(liveStreams)
      } catch (error) {
        console.error("Error fetching live news:", error)
      }
    }

    fetchLiveNews()
    const interval = setInterval(fetchLiveNews, 300000)
    return () => clearInterval(interval)
  }, [setLiveNewsStreams])

  return null
}

export default function LiveBroadcastAnalysis() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [liveNewsStreams, setLiveNewsStreams] = useState<LiveStream[]>([])
  const [draggedVideo, setDraggedVideo] = useState<LiveStream | null>(null)
  const [summary, setSummary] = useState<string>('')
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false)
  const { requestPermission } = usePushNotifications()
  const [error, setError] = useState<string | null>(null)

  const generateSummary = async (): Promise<void> => {
    setIsLoadingSummary(true)
    setError(null)

    try {
      const summaryRes = await fetch('http://localhost:5500/process')
      if (!summaryRes.ok) {
        throw new Error(`Failed to generate summary: ${summaryRes.statusText}`)
      }

      const rawData = await summaryRes.text()
      console.log('Raw server response:', rawData)

      let data: ProcessResponse
      try {
        data = JSON.parse(rawData)
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        throw new Error('Server response was not valid JSON: ' + rawData.substring(0, 100))
      }

      console.log('Parsed response data:', data)
      
      if (!data) {
        throw new Error('Empty response from server')
      }

      if (data.error) {
        throw new Error(data.error)
      }

      const summaryText = Object.entries(data)
        .map(([text, result]) => {
          return `News: "${text}"\nVerdict: ${result.Verdict}\nSimilarity: ${result["Max Similarity"]}\n`
        })
        .join('\n')

      if (summaryText) {
        setSummary(summaryText)
      } else {
        throw new Error('No results found in server response')
      }

    } catch (err) {
      console.error("Error generating summary:", err)
      setError(err instanceof Error ? err.message : "Failed to generate summary")
      setSummary("")
    } finally {
      setIsLoadingSummary(false)
    }
  }

  const handleDragStart = (stream: LiveStream): void => {
    console.log("Drag started with stream:", stream)
    setDraggedVideo(stream)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    console.log("Dragging over drop zone")
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault()
    setError(null)
  
    if (!draggedVideo) {
      console.error("No dragged video detected.")
      return
    }
  
    try {
      console.log("Sending video URL to backend:", draggedVideo.url)
  
      const response = await fetch("http://localhost:5001/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ video_url: draggedVideo.url }),
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error: ${errorText}`)
      }
  
      console.log("Request succeeded:", response)
    } catch (error) {
      console.error("Error sending request:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setDraggedVideo(null)
    }
  }

  const sendVideoUrlToBackend = async (): Promise<void> => {
    if (!draggedVideo) {
      console.error("No video selected to send.")
      return
    }
    try {
      console.log("Sending video URL to backend:", draggedVideo.url)
      const response = await fetch("http://localhost:5001/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ video_url: draggedVideo.url }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error: ${errorText}`)
      }
      console.log("Video URL sent successfully:", draggedVideo.url)
    } catch (error) {
      console.error("Error sending video URL:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select Video for Analysis</h2>
          <div
            className="aspect-video bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center rounded-lg overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={(e) => {
              e.preventDefault()
              console.log("Drag entered drop zone")
            }}
          >
            {draggedVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${draggedVideo.videoId}`}
                title={draggedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Drag a video here to start analysis
              </p>
            )}
          </div>
          <div className="flex space-x-4 mb-4">
            <Button 
              onClick={() => {
                console.log("Generate button clicked")
                setIsGenerating(prev => !prev)
              }} 
              className="flex-1"
            >
              {isGenerating ? "Stop Generating" : "Generate Videos"}
            </Button>
          </div>
          <div className="flex space-x-4 mb-4">
            <Button 
              onClick={sendVideoUrlToBackend} 
              className="flex-1"
            >
              Send Video URL to Backend
            </Button>
          </div>
          {isGenerating && <LiveNews setLiveNewsStreams={setLiveNewsStreams} />}
          {liveNewsStreams.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {liveNewsStreams.map((stream, index) => (
                <Card
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(stream)}
                  className="cursor-move hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-2">
                    <img
                      src={`https://img.youtube.com/vi/${stream.videoId}/0.jpg`}
                      alt={stream.title}
                      className="w-full h-auto mb-2 rounded"
                    />
                    <p className="text-sm font-medium truncate">{stream.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Analysis</h2>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Video Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateSummary} 
                className="mb-4"
                disabled={isLoadingSummary}
              >
                {isLoadingSummary ? "Generating Summary..." : "Generate Summary"}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-md">
                  {error}
                </div>
              )}

              {summary && !error && (
                <div className="mt-4 space-y-4">
                  {summary.split("\n\n").map((result, index) => (
                    <Card key={index} className="bg-gray-50 dark:bg-gray-900/50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {result}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}