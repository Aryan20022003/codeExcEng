//write boilerplate code for submission routes
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controller/submission");
// const submissionController = require("../controllers/submission");
// const { validateSubmission } = require("../middlewares/validation");
// const { authenticate } = require("../middlewares/authentication");

// router.post("/", authenticate, validateSubmission, submissionController.createSubmission);
// router.get("/:id", authenticate, submissionController.getSubmissionById);

router.post(
  "/",
  upload.fileUpload.single("sourceCode"),
  upload.uploadToCloud,
  upload.populateSubmissionDb,
  controller.pushToQueue
);

module.exports = router;
