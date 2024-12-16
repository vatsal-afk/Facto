"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { env } from "process";

type LiveStream = {
  title: string;
  url: string;
  videoId: string;
};

type YouTubeResponseItem = {
  snippet: {
    title: string;
  };
  id: {
    videoId: string;
  };
};

const LiveNews: React.FC<{ setLiveNewsStreams: React.Dispatch<React.SetStateAction<LiveStream[]>> }> = ({
  setLiveNewsStreams,
}) => {
  useEffect(() => {
    const fetchLiveNews = async () => {
      const YouTube_API_Key = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const search_URL = "https://www.googleapis.com/youtube/v3/search";

      try {
        const response = await axios.get(search_URL, {
          params: {
            part: "snippet",
            eventType: "live",
            type: "video",
            q: "news",
            key: YouTube_API_Key,
          },
        });
        const liveStreams = response.data.items.map((item: YouTubeResponseItem) => ({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          videoId: item.id.videoId,
        }));
        setLiveNewsStreams(liveStreams);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchLiveNews();

    const interval = setInterval(fetchLiveNews, 300000); 
    return () => clearInterval(interval); 
  }, [setLiveNewsStreams]);

  return null; 
};

export default function LiveBroadcastAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveNewsStreams, setLiveNewsStreams] = useState<LiveStream[]>([]);
  const [draggedVideo, setDraggedVideo] = useState<LiveStream | null>(null);
  const [transcription, setTranscription] = useState('');

  const toggleAnalysis = () => {
    setIsAnalyzing((prev) => !prev);
  };

  const handleDragStart = (stream: LiveStream) => {
    setDraggedVideo(stream);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (draggedVideo) {
      try {
        // Send the dragged video URL to the backend using fetch
        const response = await fetch('http://localhost:8000/transcribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ video_url: draggedVideo.url }),
          credentials: 'same-origin' // Include credentials if needed (cookies, etc.)
        });
        

        // Check if response body is not null
        if (!response.body) {
          throw new Error('Response body is null');
        }

        // Read the response as a stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let text = '';

        // Process the stream and update transcription as it arrives
        while (!done) {
          const { value, done: isDone } = await reader.read();
          done = isDone;
          text += decoder.decode(value, { stream: true });
          setTranscription(text); // Update transcription in real-time
        }

        console.log("Transcription completed:", text); // Optionally log full transcription after completion

      } catch (error: any) {
        console.error("Error sending video URL to backend:", error.message);
      }

      setDraggedVideo(null); // Clear the dragged video after processing
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Live Broadcast Analysis</h2>
      <div
        className="aspect-video bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
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
          <p>Drag a video here to view live broadcast</p>
        )}
      </div>
      <Button onClick={toggleAnalysis}>
        {isAnalyzing ? "Stop Analysis" : "Start Analysis"}
      </Button>
      <h1 className="text-xl font-semibold mb-4 mt-10">Breaking News</h1>
      <h2>drag and drop an item into the window to view its knowledge graph.</h2>
      {isAnalyzing && <LiveNews setLiveNewsStreams={setLiveNewsStreams} />}
      {liveNewsStreams.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveNewsStreams.map((stream, index) => (
            <div
              key={index}
              className="aspect-video bg-gray-100 dark:bg-gray-700 p-2 rounded-lg shadow cursor-pointer"
              draggable
              onDragStart={() => handleDragStart(stream)}
            >
              <h3 className="text-sm font-semibold mb-2">{stream.title}</h3>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${stream.videoId}`}
                title={stream.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
      </div>
    )}
  </div>
  );
}
