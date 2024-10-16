const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const submission = require("./routes/submission");
const redisClient = require("./redis");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const reteLimiter = (req, res, next) => {
  const ip = req.ip == `::1` || `127.0.0.1` ? `localhost` : req.ip;
  console.log(ip);
  if (ip === `localhost`) return next();

  redisClient.get(ip, (err, data) => {
    if (err) throw err;

    const limit = 10;
    const duration = 24 * 60 * 60;

    if (data == null) {
      redisClient.set(ip, 1);
      redisClient.expire(ip, duration);
      res.locals.remainingCount = limit - 1;
      return next();
    } else if (parseInt(data) >= limit) {
      return res.status(429).json({
        message: "Too many requests exceeded the limit of 10 requests per day",
      });
    } else {
      redisClient.incr(ip);
      res.locals.remainingCount = limit - parseInt(data) - 1;
      return next();
    }
  });
};
app.use(reteLimiter);
// Routes
app.use("/ping", (req, res) => {
  res.json({ message: "pong" });
});
app.use("/api/v1/submission", submission);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

module.exports = app;
