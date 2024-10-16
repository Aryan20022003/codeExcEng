const fileUtils = require("../../utils/fileUtils");
const bucketDestination = require("../../config/serviceAccount");
const globalQueue = require("../../queue/queue");
const pool = require("../../config/db");
const { operationQueries } = require("../queries");

//TODO : Implement the function to push to queue and return the response
//req.cloudData={uploadAddress,fileName,id}

const pushToQueue = async (req, res) => {
  try {
    // Implement the function to push to queue
    // console.log(`pushToQueue ${req.cloudData.id}`);
    //cloudData={id,uploadAddress,fileName,localFilePath,codeUrl}
    await globalQueue.add(
      `${req.cloudData.id}_${req.cloudData.fileName}`,
      req.cloudData,
      { removeOnComplete: true, removeOnFail: 5000 }
    );
    const uploadId = await pool.query(operationQueries.insertDummyExecution, [
      req.cloudData.id,
    ]);
    console.log(
      "uploaded to executionDummyDb id: ",
      uploadId.rows[0].id,
      "submission id:",
      req.cloudData.id
    );
    res.status(200).json({
      message: "File uploaded and pushed to queue successfully",
      id: req.cloudData.id,
      fileName: req.cloudData.fileName,
    });
  } catch (error) {
    console.error("Error pushing to queue:", error.message);
    res.status(500).json({
      message: "An error occurred during file upload",
      error: error.message,
    });
  }
};

const getExecutedUrl = async (req, res) => {
  try {
    // Implement the function to get executed url
    const { id } = req.query;
    if (!id) {
      res.status(400).json({
        message: "Id is required",
      });
      return;
    }
    const executedUrl = await pool.query(operationQueries.getOutputFilePath, [
      id,
    ]);
    const uploadPath = executedUrl.rows[0].outputfilepath;
    if (!uploadPath) {
      res.status(404).json({
        message: "file under process or not found",
      });
      return;
    }
    const getSignedUrl = await fileUtils.signedUrl(uploadPath);
    console.log(getSignedUrl);

    // console.log("executedUrl", executedUrl.rows[0]);
    if (executedUrl.rows.length === 0) {
      const status = await pool.query(operationQueries.getStatus, [id]);
      res.status(404).json({
        message: "Executed url not found",
        status: status.rows[0].status,
      });
      return;
    }
    res.status(200).json({
      message: "Executed url fetched successfully",
      codeId: id,
      executedUrl: getSignedUrl,
    });
  } catch (error) {
    console.error("Error getting executed url:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { pushToQueue, getExecutedUrl };
