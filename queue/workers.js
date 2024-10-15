const { Worker } = require("bullmq");
const path = require("path");
const sandboxProcessPath = path.join(__dirname, "sandboxProcess.js");
const queueName = "globalQueue";

const workers = [];

const createWorkers = async () => {
  if (workers.length > 0) return workers;
  const workerCount = process.env.WORKER_COUNT || 5;
  for (let i = 0; i < workerCount; i++) {
    workers.push(
      new Worker(queueName, sandboxProcessPath, {
        connection: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      })
    );
    workers[i].on("completed", (job) => {
      console.log(`Job ${job.id} completed`);
    });
    workers[i].on("failed", (job, err) => {
      console.log(`Job ${job.id} failed with error ${err.message}`);
    });
  }
  console.log("Workers created", Date.now());
  return workers;
};

module.exports = createWorkers;
