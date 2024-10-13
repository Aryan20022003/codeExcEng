const { Queue } = require("bullmq");

const myQueue = new Queue("globalQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

console.log(`Queue created ${Date.now()}`);
module.exports = myQueue;
