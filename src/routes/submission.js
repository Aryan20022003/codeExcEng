//write boilerplate code for submission routes
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controller/submission");

router.post(
  "/",
  upload.fileUpload.single("sourceCode"),
  upload.uploadToCloud,
  upload.populateSubmissionDb,
  upload.addDownloadUrls,
  controller.pushToQueue
);
router.post("/url", upload.bringFileToLocal, controller.pushToQueue);
router.get("/url", controller.getExecutedUrl);

module.exports = router;
