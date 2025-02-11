const { exec } = require('child_process');
const { getRedisClient } = require('../config/redis_config');
const r = getRedisClient();

// Summarize the text chunks via Python
const summarizeChunks = async (chunkFilePath) => {
  return new Promise((resolve, reject) => {
    exec(`python3 summary.py ${chunkFilePath}`, (err, stdout, stderr) => {
      if (err) reject(err);
      if (stderr) reject(stderr);
      resolve(stdout.trim()); // Return the summary text
    });
  });
};

// Store summary in Redis
const storeSummaryInRedis = async (sessionId, chunkIndex, summary) => {
  await r.setAsync(`summary:${sessionId}:${chunkIndex}`, summary, 'EX', 900);
  console.log(`Stored summary for chunk ${chunkIndex}`);
};

module.exports = { summarizeChunks, storeSummaryInRedis };
