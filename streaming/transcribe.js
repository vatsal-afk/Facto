const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const { SpeechClient } = require('@google-cloud/speech');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Initialize Google Cloud Speech client
const client = new SpeechClient();

// Set up Express app
const app = express();
app.use(express.json());

// Google Cloud Speech-to-Text configuration
const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  },
  interimResults: true,
};

app.post('/transcribe', async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).send('Invalid or missing video URL');
  }
  console.log('Video URL:', videoUrl);

  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Create temporary file paths
  const tempDir = os.tmpdir();
  const tempInputFile = path.join(tempDir, `input-${Date.now()}.wav`);
  const tempOutputFile = path.join(tempDir, `output-${Date.now()}.wav`);

  // Initialize a stream for Google Cloud Speech API
  const recognizeStream = client
    .streamingRecognize(request)
    .on('data', (data) => {
      if (data.results[0] && data.results[0].alternatives[0]) {
        const transcript = data.results[0].alternatives[0].transcript;
        console.log('Transcription: ', transcript);
        res.write(`${transcript}\n`);
      }
    })
    .on('error', (err) => {
      console.error('Error during streaming recognition:', err);
      res.write(`Error during transcription: ${err.message}\n`);
      cleanup();
    })
    .on('end', () => {
      console.log('Recognition streaming ended');
      cleanup();
    });

  const cleanup = () => {
    // Clean up temporary files
    try {
      if (fs.existsSync(tempInputFile)) fs.unlinkSync(tempInputFile);
      if (fs.existsSync(tempOutputFile)) fs.unlinkSync(tempOutputFile);
    } catch (err) {
      console.error('Error cleaning up temporary files:', err);
    }
    
    if (!res.writableEnded) {
      res.end();
    }
  };

  try {
    // First, download audio using yt-dlp
    const ytDlp = spawn('yt-dlp', [
      '-f', 'bestaudio',
      '--extract-audio',
      '--audio-format', 'wav',
      '--audio-quality', '0',
      '-o', tempInputFile,
      videoUrl
    ]);

    ytDlp.stderr.on('data', (data) => {
      console.log(`yt-dlp stderr: ${data}`);
    });

    ytDlp.on('error', (err) => {
      console.error('yt-dlp error:', err);
      res.write(`Error fetching video: ${err.message}\n`);
      cleanup();
    });

    // When yt-dlp finishes, process with FFmpeg
    ytDlp.on('close', (code) => {
      if (code !== 0) {
        console.error(`yt-dlp process exited with code ${code}`);
        res.write(`Error downloading audio: process exited with code ${code}\n`);
        cleanup();
        return;
      }

      // Process the audio file with FFmpeg
      ffmpeg(tempInputFile)
        .audioFrequency(16000)
        .audioChannels(1)
        .audioCodec('pcm_s16le')
        .format('wav')
        .save(tempOutputFile)
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          res.write(`Error processing audio: ${err.message}\n`);
          cleanup();
        })
        .on('end', () => {
          console.log('FFmpeg processing finished');
          
          // Create read stream from the processed file
          const audioStream = fs.createReadStream(tempOutputFile);
          audioStream.pipe(recognizeStream);
          
          audioStream.on('error', (err) => {
            console.error('Error reading audio file:', err);
            cleanup();
          });
        });
    });

    // Handle client disconnect
    req.on('close', () => {
      console.log('Client disconnected');
      cleanup();
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.write(`Unexpected error: ${err.message}\n`);
    cleanup();
  }
});

app.listen(5001, () => {
  console.log('Server is running on http://localhost:5001');
});