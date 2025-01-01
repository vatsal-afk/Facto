const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// POST endpoint for transcription
app.post("/transcribe", (req, res) => {
  const { video_url } = req.body;
  const audioDir = path.join(__dirname, "segments");

  if (!video_url) {
    return res.status(400).json({ error: "No video URL provided" });
  }

  // Ensure the segment directory exists
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
  }

  // Execute bash script to download and segment audio
  const command = `bash process_audio.sh "${video_url}" "${audioDir}"`;
  const segmentProcess = exec(command);

  segmentProcess.on("error", (err) => {
    console.error(`[Error]: Bash script error: ${err.message}`);
    res.status(500).json({ error: `Failed to process video: ${err.message}` });
  });

  segmentProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`[Error]: Bash script exited with code ${code}`);
      res.status(500).json({ error: "Segmentation process failed" });
    } else {
      console.log("[Info]: Bash script completed successfully.");
      watchAndTranscribeSegments(audioDir);
      res.status(200).json({ message: "Transcription started" });
    }
  });
});

// Transcription function with periodic processing
async function transcribeSegment(segmentPath) {
  return new Promise((resolve, reject) => {
    const outputFilePath = path.join(__dirname, "transcription", `${path.basename(segmentPath, ".aac")}.txt`);

    // Whisper command to transcribe the audio file
    const whisperCommand = `whisper "${segmentPath}" --model base --output_format txt --output_dir "${__dirname}/transcription"`;

    exec(whisperCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Error]: Whisper command failed: ${stderr}`);
        return reject(error);
      }

      // Wait for the transcription to be written to file
      let attempts = 0;
      const checkFileExists = setInterval(() => {
        attempts++;
        if (fs.existsSync(outputFilePath)) {
          clearInterval(checkFileExists);
          const transcription = fs.readFileSync(outputFilePath, "utf8").trim();
          resolve(transcription);
        } else if (attempts > 30) {  // Timeout after 15 seconds
          clearInterval(checkFileExists);
          reject(new Error(`Transcription file not found after processing: ${outputFilePath}`));
        }
      }, 500);  // Check every 500 milliseconds
    });
  });
}

// Watch for new segments and process each one
function watchAndTranscribeSegments(audioDir) {
  fs.watch(audioDir, async (eventType, filename) => {
    if (eventType === "rename" && filename.endsWith(".aac")) {
      const segmentPath = path.join(audioDir, filename);

      try {
        console.log(`[Info]: Processing segment: ${filename}`);
        const transcription = await transcribeSegment(segmentPath);

        // Send the transcription to your friend's analysis model (via API)
        await sendToAnalysisModel(transcription);

        // Clean up the processed segment file
        fs.unlinkSync(segmentPath);
        
        // Wait for 10 seconds before processing the next segment
        console.log("[Info]: Waiting 10 seconds before processing the next segment...");
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
      } catch (err) {
        console.error(`[Error]: Failed to process segment ${filename}: ${err.message}`);
      }
    }
  });
}

app.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});
