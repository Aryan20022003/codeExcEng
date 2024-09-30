const fileUtils = require("../../utils/fileUtils");
const bucketDestination = require("../../config/serviceAccount");

const executionWithInput = async (req, res) => {
  try {
    const localFilePath = req.file.path;
    const extension = req.file.originalname.split(".").pop();
    const fileName = req.file.filename;
    const uploadAddress = `${bucketDestination.uploadDestination}${fileName}`;
    const metadata = {
      fileName: fileName,
      extension: extension,
      date: Date.now(),
    };
    // console.log(
    //   `localFilePath ${localFilePath} extension of file ${extension} fileName ${fileName}`
    // );

    const upload = await fileUtils.uploadFileToBucket(
      localFilePath,
      uploadAddress,
      metadata
    );
    res.status(200).json({
      message: "File uploaded successfully",
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error during file upload:", error.message);
    res.status(500).json({
      message: "An error occurred during file upload",
      error: error.message,
    });
  }
};

module.exports = { executionWithInput };
