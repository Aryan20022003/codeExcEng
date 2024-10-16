const Redis = require("ioredis");

// Create a new Redis client instance
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
redis.on("connect", function () {
  console.log("Connected to Redis");
});
redis.on("error", function (error) {
  throw error;
});

module.exports = redis;
