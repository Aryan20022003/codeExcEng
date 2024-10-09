const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const submission = require("./routes/submission");
const pool = require("./../config/db");
// const execution = require("./routes/execution");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/ping', (req, res) => {
  res.json({ message: "pong" });
});
app.use('/api/v1/submission', submission);
// app.use('/api/v1/execution', execution);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

module.exports = app;
