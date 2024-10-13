const app = require("./app");
const pool = require("./../config/db");
const firebase = require("./../config/firebase");
const myQueue=require('../queue/queue');
const createWorkers=require('../queue/workers');
createWorkers()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`${__dirname}`);
});
