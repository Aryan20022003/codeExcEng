const fileUtils = require("../../utils/fileUtils");
const bucketDestination = require("../../config/serviceAccount");

//TODO : Implement the function to push to queue and return the response 
//req.cloudData={uploadAddress,fileName,uploadId}

const pushToQueue = async (req, res) => {
  try {
    // Implement the function to push to queue
    // console.log(`pushToQueue ${req.cloudData.uploadId}`);
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
