'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import axios from "axios"
import usePushNotifications from "./notifications"

type LiveStream = {
  title: string
  url: string
  videoId: string
}

type YouTubeResponseItem = {
  snippet: {
    title: string
  }
  id: {
    videoId: string
  }
}

const LiveNews: React.FC<{ setLiveNewsStreams: React.Dispatch<React.SetStateAction<LiveStream[]>> }> = ({
  setLiveNewsStreams,
}) => {
  useEffect(() => {
    const fetchLiveNews = async () => {
      const YouTube_API_Key = "AIzaSyCXZVLg48y855cUljUqco5OIwpqOy2W_hA"
      if (!YouTube_API_Key) {
        console.error("YouTube API key is not configured")
        return
      }

      try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
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

// const mockSentimentData = [
//   { time: '0:00', positive: 60, negative: 40, neutral: 20 },
//   { time: '0:05', positive: 65, negative: 35, neutral: 25 },
//   { time: '0:10', positive: 70, negative: 30, neutral: 22 },
//   { time: '0:15', positive: 68, negative: 32, neutral: 28 },
//   { time: '0:20', positive: 72, negative: 28, neutral: 24 },
// ]

// const mockKeywordsData = [
//   { keyword: 'Economy', count: 15 },
//   { keyword: 'Politics', count: 12 },
//   { keyword: 'Technology', count: 10 },
//   { keyword: 'Healthcare', count: 8 },
//   { keyword: 'Education', count: 6 },
// ]

export default function LiveBroadcastAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [liveNewsStreams, setLiveNewsStreams] = useState<LiveStream[]>([])
  const [draggedVideo, setDraggedVideo] = useState<LiveStream | null>(null)
  const [transcription, setTranscription] = useState('')
  const { requestPermission } = usePushNotifications()
  const [error, setError] = useState<string | null>(null)

  // Event Source for handling SSE
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [eventSource])

  const toggleGeneration = () => {
    setIsGenerating((prev) => !prev)
    if (!isGenerating) {
      setLiveNewsStreams([])
    }
  }

  const toggleAnalysis = () => {
    setIsAnalyzing((prev) => !prev)
    if (!isAnalyzing) {
      setTranscription('')
      if (eventSource) {
        eventSource.close()
      }
    }
  }

  const handleDragStart = (stream: LiveStream) => {
    console.log("Drag started with stream:", stream);
    setDraggedVideo(stream);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    console.log("Dragging over drop zone") // Debug log
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(null);
  
    if (!draggedVideo) {
      console.error("No dragged video detected.");
      return;
    }
  
    try {
      console.log("Sending video URL to backend:", draggedVideo.url);
  
      const response = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ video_url: draggedVideo.url }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }
  
      console.log("Request succeeded:", response);
    } catch (error) {
      console.error("Error sending request:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setDraggedVideo(null);
    }
  };

  const sendVideoUrlToBackend = async () => {
    if (!draggedVideo) {
      console.error("No video selected to send.");
      return;
    }
    try {
      console.log("Sending video URL to backend:", draggedVideo.url);
      const response = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ video_url: draggedVideo.url }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }
      console.log("Video URL sent successfully:", draggedVideo.url);
    } catch (error) {
      console.error("Error sending video URL:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select Video for Analysis</h2>
          <div
            className="aspect-video bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center rounded-lg overflow-hidden"
            onDrop={(e) => {
              e.preventDefault();
              console.log("Drop zone entered");
              console.log("Current draggedVideo:", draggedVideo);
              handleDrop(e);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              console.log("Dragging over drop zone");
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              console.log("Drag entered drop zone");
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
                console.log("Generate button clicked") // Debug log
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
          <h2 className="text-2xl font-semibold mb-4">Transcription</h2>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Live Transcription</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap">
                {transcription || "No transcription available yet. Drag a video to begin analysis."}
              </pre>
            </CardContent>
          </Card>
          {/* <Card> 
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sentiment">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
                  <TabsTrigger value="keywords">Key Topics</TabsTrigger>
                </TabsList>
                <TabsContent value="sentiment">
                  <ChartContainer
                    config={{
                      positive: {
                        label: "Positive",
                        color: "hsl(var(--chart-1))",
                      },
                      negative: {
                        label: "Negative",
                        color: "hsl(var(--chart-2))",
                      },
                      neutral: {
                        label: "Neutral",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockSentimentData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="positive" stroke="var(--color-positive)" strokeWidth={2} />
                        <Line type="monotone" dataKey="negative" stroke="var(--color-negative)" strokeWidth={2} />
                        <Line type="monotone" dataKey="neutral" stroke="var(--color-neutral)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TabsContent>
                <TabsContent value="keywords">
                  <ul className="space-y-2">
                    {mockKeywordsData.map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{item.keyword}</span>
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                          {item.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>*/}
        </div>
      </div>
    </div>
  )
}
