const { worker } = require("bullmq");
const { path } = require("../src/app");
const sandboxProcessPath = path.resolve(__dirname, "sandboxProcess.js");
const queueName = "globalQueue";

const workers = [];

const createWorkers = async () => {
  if (workers.length > 0) return workers;
  const workerCount = process.env.WORKER_COUNT || 5;
  for (let i = 0; i < workerCount; i++) {
    workers.push(new worker(queueName, sandboxProcessPath));
  }
  console.log("Workers created", Date.now());
  return workers;
};

module.exports = createWorkers;
