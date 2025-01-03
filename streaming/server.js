const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Serve the transcription folder statically
app.use('/transcription', express.static(path.join(__dirname, 'transcription')));

// POST endpoint for transcription
app.post("/transcribe", (req, res) => {
  const { video_url } = req.body;
  console.log(`Video URL received: "${video_url}"`);
  const audioDir = path.join(__dirname, "segments");

  if (!video_url) {
    return res.status(400).json({ error: "No video URL provided" });
  }

  // Ensure the segment directory exists
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
  }

  // Execute bash script to download and process audio
  console.log("bash script started");
  const command = `bash process_audio.sh "${video_url}" "${audioDir}"`;
  const segmentProcess = exec(command);

  segmentProcess.on("error", (err) => {
    console.error(`[Error]: Bash script error: ${err.message}`);
    res.status(500).json({ error: `Failed to process video: ${err.message}` });
  });

  segmentProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`[Error]: Bash script exited with code ${code}`);
      res.status(500).json({ error: "Audio processing failed" });
    } else {
      console.log("[Info]: Bash script completed successfully.");
      const audioFilePath = path.join(audioDir, "output_audio.aac");
      transcribeAudio(audioFilePath, res);
    }
  });
});

// Transcription function to process the entire audio file
async function transcribeAudio(audioFilePath, res) {
  const outputFilePath = path.join(__dirname, "transcription", "transcription.txt");

  // Whisper command to transcribe the audio file
  const whisperCommand = `whisper "${audioFilePath}" --model base --output_format txt --output_dir "${__dirname}/transcription"`;

  exec(whisperCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`[Error]: Whisper command failed: ${stderr}`);
      return res.status(500).json({ error: "Transcription failed" });
    }

    // Check if the transcription file exists
    const checkFileExists = setInterval(() => {
      if (fs.existsSync(outputFilePath)) {
        clearInterval(checkFileExists);
        const transcription = fs.readFileSync(outputFilePath, "utf8").trim();
        console.log("[Info]: Transcription completed");

        // Send the transcription file's URL as response
        const transcriptionUrl = `/transcription/transcription.txt`;
        res.status(200).json({
          message: "Transcription completed",
          transcriptionUrl: transcriptionUrl,
        });
      }
    }, 500);  // Check every 500 milliseconds
  });
}

app.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});
