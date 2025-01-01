const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8000;

app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend's origin
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Accept"],
}));

app.use(express.json());

const audioDir = path.join(__dirname, "segments");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

app.post("/transcribe", async (req, res) => {
  console.log("[Info]: Received request at /transcribe");
  console.log("Request body:", req.body);

  const { video_url } = req.body;

  if (!video_url) {
    console.error("[Error]: No video URL provided");
    return res.status(400).json({ error: "No video URL provided" });
  }

  try {
    console.log(`[Info]: Starting transcription for video: ${video_url}`);
    // Your existing segmentation/transcription logic
    res.status(200).json({ message: "Processing started" });
  } catch (err) {
    console.error(`[Error]: Failed to process video: ${err.message}`);
    res.status(500).json({ error: `Failed to process video: ${err.message}` });
  }
});


// Helper function to watch and transcribe audio segments
function watchAndTranscribeSegments(res) {
  console.log(`[Info]: Watching directory for new segments: ${audioDir}`);
  
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendTranscription = (transcriptions) => {
    res.write(`data: ${JSON.stringify(transcriptions)}\n\n`);
  };

  fs.watch(audioDir, async (eventType, filename) => {
    if (eventType === "rename" && filename.endsWith(".aac")) {
      const segmentPath = path.join(audioDir, filename);
      
      try {
        const transcription = await transcribeSegment(segmentPath);
        sendTranscription({ segment: filename, transcription });
        fs.unlinkSync(segmentPath); // Cleanup processed file
      } catch (err) {
        console.error(`[Error]: Failed to transcribe segment ${filename}: ${err.message}`);
      }
    }
  });

  res.on("close", () => {
    console.log("[Info]: Client disconnected, stopping transcription.");
    res.end();
  });
}


// Helper function to transcribe audio segment using Whisper
async function transcribeSegment(segmentPath) {
  return new Promise((resolve, reject) => {
    const whisperCommand = `whisper "${segmentPath}" --model base --output_format txt`;
    console.log(`[Executing]: ${whisperCommand}`);

    exec(whisperCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Error]: Whisper transcription failed: ${error.message}`);
        return reject(error);
      }

      if (stderr) {
        console.warn(`[Warning]: ${stderr}`);
      }

      resolve(stdout.trim()); // Return the transcription result
    });
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
