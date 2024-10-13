const app = require("./app");
const pool = require("./../config/db");
const firebase = require("./../config/firebase");
const myQueue = require("../queue/queue");
const createWorkers = require("../queue/workers");
createWorkers();

//TODO:Move to different file and call it from there
const { createQueries } = require("./queries");
pool
  .query(createQueries.createSubmissionTableDummy)
  .then((res) => {
    console.log("Table created");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`${__dirname}`);
});
