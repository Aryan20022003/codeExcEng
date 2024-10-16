const app = require("./app");
const pool = require("./../config/db");
const firebase = require("./../config/firebase");
const myQueue = require("../queue/queue");
const createWorkers = require("../queue/workers");
createWorkers();

//TODO:Move to different file and call it from there
const { createQueries } = require("./queries");
Promise.all([
  pool.query(createQueries.createSubmissionTableDummy),
  pool.query(createQueries.createDummyExecutionTable),
])
  .then(() => {
    console.log("Tables created");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`${__dirname}`);
});
