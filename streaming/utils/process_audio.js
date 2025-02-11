const { extractAudioFromVideo } = require('../config/ffmpegConfig');
const { startTranscription } = require('./transcribe_stream');
const fs = require('fs');
const path = require('path');

// Process the URL and extract audio
const processAudio = async (videoUrl) => {
  const audioFilePath = path.join(__dirname, 'audio', 'temp_audio.wav');
  
  // Extract audio from video using FFmpeg
  await extractAudioFromVideo(videoUrl, audioFilePath);

  // Proceed to transcription
  await startTranscription(audioFilePath);
};

module.exports = { processAudio };
