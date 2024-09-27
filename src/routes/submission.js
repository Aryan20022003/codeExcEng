//write boilerplate code for submission routes
const express = require("express");
const router = express.Router();
const upload=require("../middleware/upload");
const uploadController=require("../controller/upload")
// const submissionController = require("../controllers/submission");
// const { validateSubmission } = require("../middlewares/validation");
// const { authenticate } = require("../middlewares/authentication");


// router.post("/", authenticate, validateSubmission, submissionController.createSubmission);
// router.get("/:id", authenticate, submissionController.getSubmissionById);

router.post("/",upload.fileUpload.single('sourceCode'),uploadController.bucketUpload);

module.exports = router;