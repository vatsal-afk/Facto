const { getRedisClient } = require('../config/redisConfig');

const r = getRedisClient();

// Retrieve summary chunks from Redis
const getSummaryFromRedis = async (sessionId, chunkIndex) => {
  try {
    const summaryData = await new Promise((resolve, reject) => {
      r.get(`audio_chunk:${chunkIndex}`, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });

    if (!summaryData) {
      return { status: 'no summary available yet' };
    }

    return JSON.parse(summaryData);
  } catch (error) {
    console.error('Error fetching from Redis:', error);
    throw new Error('Error fetching summary');
  }
};

module.exports = { getSummaryFromRedis };
