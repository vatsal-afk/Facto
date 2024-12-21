const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8000;

app.use(cors()); // Enable CORS for all origins
app.use(express.json());

const audioDir = path.join(__dirname, "segments");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

app.post("/transcribe", async (req, res) => {
  const { video_url } = req.body;

  if (!video_url) {
    console.error("[Error]: No video URL provided");
    return res.status(400).json({ error: "No video URL provided" });
  }

  try {
    console.log(`[Info]: Starting live transcription for video: ${video_url}`);

    const segmentCommand = `
      yt-dlp -f bestaudio --live-from-start "${video_url}" -o - |
      ffmpeg -i pipe:0 -f segment -segment_time 30 -c copy "${audioDir}/audio_%03d.aac"
    `;
    console.log(`[Executing]: ${segmentCommand}`);
    const segmentProcess = exec(segmentCommand);

    // Step 2: Watch for new audio segments and transcribe
    watchAndTranscribeSegments(res);

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

  let transcriptions = [];

  fs.watch(audioDir, async (eventType, filename) => {
    if (eventType === "rename" && filename.endsWith(".aac")) {
      const segmentPath = path.join(audioDir, filename);

      try {
        const transcription = await transcribeSegment(segmentPath);
        transcriptions.push({ segment: filename, transcription });

        console.log(transcription);

        // Cleanup processed file
        fs.unlinkSync(segmentPath);
      } catch (err) {
        console.error(`[Error]: Failed to transcribe segment ${filename}: ${err.message}`);
      }
    }
  });

  // Send transcription updates every 10 seconds
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify(transcriptions)}\n\n`);
  }, 10000);

  res.on("close", () => {
    console.log("[Info]: Client disconnected, stopping transcription.");
    clearInterval(interval);
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
