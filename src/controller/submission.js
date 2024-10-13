const fileUtils = require("../../utils/fileUtils");
const bucketDestination = require("../../config/serviceAccount");
const globalQueue = require("../../queue/queue");

//TODO : Implement the function to push to queue and return the response
//req.cloudData={uploadAddress,fileName,uploadId}

const pushToQueue = async (req, res) => {
  try {
    // Implement the function to push to queue
    // console.log(`pushToQueue ${req.cloudData.uploadId}`);
    //cloudData={uploadAddress,fileName,uploadId,extension}
    await globalQueue.add(
      `${req.cloudData.uploadId}_${req.cloudData.fileName}`,
      req.cloudData,
      { removeOnComplete: true, removeOnFail: 5000 }
    );
    res.status(200).json({
      message: "File uploaded and pushed to queue successfully",
      uploadId: req.cloudData,
    });
  } catch (error) {
    console.error("Error pushing to queue:", error.message);
    res.status(500).json({
      message: "An error occurred during file upload",
      error: error.message,
    });
  }
};

module.exports = { pushToQueue };
