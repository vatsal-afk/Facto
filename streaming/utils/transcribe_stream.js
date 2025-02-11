const ffmpeg = require('fluent-ffmpeg');
const { getRedisClient } = require('../config/redisConfig');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Get Redis client
const r = getRedisClient();

// Process and chunk the audio
const startTranscription = async (audioFilePath) => {
  try {
    const chunkDuration = 2 * 60;  // 2 minutes per chunk
    const audioDir = path.join(__dirname, 'audio_chunks');

    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir);
    }

    // Run yt-dlp and FFmpeg for extracting and chunking audio
    const chunkFilePaths = await extractAndChunkAudio(audioFilePath, audioDir, chunkDuration);

    // Process chunks and send them to Redis
    for (let i = 0; i < chunkFilePaths.length; i++) {
      await r.setAsync(`audio_chunk:${i}`, chunkFilePaths[i], 'EX', 900); // Store chunk in Redis
      console.log(`Stored audio chunk ${i}`);
    }
    
  } catch (error) {
    console.error('Error during transcription process:', error);
  }
};

// Helper to run ffmpeg and split audio into chunks
const extractAndChunkAudio = async (audioFilePath, audioDir, chunkDuration) => {
  return new Promise((resolve, reject) => {
    const chunkFilePaths = [];
    ffmpeg(audioFilePath)
      .audioCodec('pcm_s16le')
      .outputOptions([
        `-f segment`,
        `-segment_time ${chunkDuration}`, // 2 minutes per chunk
        `-segment_format wav`,
        `-map 0:a`
      ])
      .on('end', () => resolve(chunkFilePaths))
      .on('error', reject)
      .on('data', (data) => {
        // Store chunk file path in array
        const chunkPath = path.join(audioDir, `chunk_${chunkFilePaths.length}.wav`);
        chunkFilePaths.push(chunkPath);
      })
      .save(path.join(audioDir, 'chunk_%03d.wav'));
  });
};

module.exports = { startTranscription };
