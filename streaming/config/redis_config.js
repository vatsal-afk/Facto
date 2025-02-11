const redis = require('redis');

// Set up Redis client
const getRedisClient = () => {
  return redis.createClient({
    host: 'localhost',
    port: 6379
  });
};

module.exports = { getRedisClient };
