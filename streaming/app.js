const express = require('express');
const cors = require('cors');
const { processAudio } = require('./utils/process_audio');
const { startTranscription } = require('./utils/transcribe_stream');
const { getSummaryFromRedis } = require('./utils/task_queues');

const app = express();
const port = 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint to start audio processing and transcription
app.post('/start_summary', async (req, res) => {
  const { videoUrl } = req.body;

  try {
    // Process audio and start transcription
    await startTranscription(videoUrl);
    res.json({ status: 'processing started', message: 'Audio and captioning in progress' });
  } catch (error) {
    console.error('Error during processing:', error);
    res.status(500).json({ error: 'Error starting summary' });
  }
});

// Endpoint to get summary chunks from Redis
app.get('/get_summary/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const chunkIndex = parseInt(req.query.chunkIndex || 0, 10);

  try {
    const summaryData = await getSummaryFromRedis(sessionId, chunkIndex);
    res.json(summaryData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching summary' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
