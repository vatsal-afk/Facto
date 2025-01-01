const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");

const app = express();
const port = 8000;
const audioDir = path.join(__dirname, "segments");

app.use(cors()); // Enable CORS for all origins
app.use(express.json());

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

// Setup WebSocket server
const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket server running on ws://localhost:8080");

let clients = [];
wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("[Info]: Client connected");

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("[Info]: Client disconnected");
  });
});

// Function to broadcast to all connected clients
function broadcast(data) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

app.post("/transcribe", async (req, res) => {
  const { video_url } = req.body;

  if (!video_url) {
    console.error("[Error]: No video URL provided");
    return res.status(400).json({ error: "No video URL provided" });
  }

  try {
    console.log(`[Info]: Starting live transcription for video: ${video_url}`);

    // Download and segment audio
    const segmentCommand = `
      yt-dlp -f bestaudio --live-from-start "${video_url}" -o - |
      ffmpeg -i pipe:0 -f segment -segment_time 10 -c copy "${audioDir}/audio_%03d.aac"
    `;
    const segmentProcess = exec(segmentCommand);

    // Watch and transcribe segments
    watchAndTranscribeSegments();

    // Handle errors
    segmentProcess.on("error", (err) => {
      console.error(`[Error]: Failed to segment live stream: ${err.message}`);
      res.status(500).json({ error: `Failed to segment live stream: ${err.message}` });
    });

    segmentProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`[Error]: Segmentation process exited with code ${code}`);
      } else {
        console.log("[Info]: Segmentation process completed.");
      }
    });

    res.status(200).json({ message: "Transcription started" });
  } catch (err) {
    console.error(`[Error]: Failed to process video: ${err.message}`);
    res.status(500).json({ error: `Failed to process video: ${err.message}` });
  }
});

// Helper function to watch and transcribe segments
function watchAndTranscribeSegments() {
  console.log(`[Info]: Watching directory for new segments: ${audioDir}`);

  fs.watch(audioDir, async (eventType, filename) => {
    if (eventType === "rename" && filename.endsWith(".aac")) {
      const segmentPath = path.join(audioDir, filename);

      try {
        const transcription = await transcribeSegment(segmentPath);
        console.log(`[Transcription]: ${transcription}`); // Log the transcription result

        // Send transcription over WebSocket
        broadcast({ filename, transcription });

        // Cleanup processed file
        fs.unlinkSync(segmentPath);
      } catch (err) {
        console.error(`[Error]: Failed to transcribe segment ${filename}: ${err.message}`);
      }
    }
  });
}

// Helper function to transcribe audio segment
async function transcribeSegment(segmentPath) {
  return new Promise((resolve, reject) => {
    const whisperCommand = `whisper "${segmentPath}" --model base --output_format txt --output_dir "${audioDir}"`;
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
  console.log(`HTTP server running on http://localhost:${port}`);
});
