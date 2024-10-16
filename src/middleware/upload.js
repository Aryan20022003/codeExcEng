const multer = require("multer");
const nameUtils = require("../../utils/fileName");
const path = require("path");
const fs = require("fs");
const fileUtils = require("../../utils/fileUtils");
const bucketDestination = require("../../config/serviceAccount");
const { operationQueries } = require("../queries");
const pool = require("../../config/db");
const { uniqueFileName } = require("../../utils/fileName");
const { randomInt } = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, nameUtils.uniqueFileName(path.extname(file.originalname)));
  },
});

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /cpp|java|py/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype =
      file.mimetype === "text/x-c" ||
      file.mimetype === "text/x-java" ||
      file.mimetype === "text/x-python" ||
      extname;

    if (mimetype && extname) {
      console.log(`file upload successfully`);
      return cb(null, true);
    } else {
      cb(new Error("Only C++, Java, and Python files are allowed"));
    }
  },
});

const uploadToCloud = async (req, resp, next) => {
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
    const cloudData = {
      fileName: fileName,
      uploadAddress: uploadAddress,
      localFilePath: localFilePath,
    };
    req.cloudData = cloudData;
    next();
  } catch (error) {
    console.error("Error during file upload:", error.message);
    resp.status(500).json({
      message: "An error occurred during file upload",
      error: error.message,
    });
  }
};
//req.cloudData={uploadAddress,fileName,localFilePath}----> {id,uploadAddress,fileName,localFilePath}
const populateSubmissionDb = async (req, res, next) => {
  const data = req.cloudData;
  console.log(`data ${data}`);
  try {
    const uploadId = await pool.query(operationQueries.insertSubmissionDummy, [
      data.uploadAddress,
    ]);
    req.cloudData.id = uploadId.rows[0].id;
    console.log(`uploaded to dummyDB -> queue id ${uploadId.rows[0].id}`);
    next();
  } catch (error) {
    console.error("error in populateSubmissionDb", error.message);
    res.status(500).json({
      message: "An error occurred during file upload",
    });
  }
};
const addDownloadUrls = async (req, res, next) => {
  try {
    const data = req.cloudData;
    const signedUrl = await fileUtils.signedUrl(data.uploadAddress);
    req.cloudData.codeUrl = signedUrl[0];
    next();
  } catch (error) {
    console.error("error in addDownloadUrls", error.message);
    res.status(500).json({
      message: "An error occurred during file upload",
    });
  }
};

const bringFileToLocal = async (req, res, next) => {
  try {
    const url = req.body.url;
    const fileExt = req.body.extension || ".cpp";
    const fileName = uniqueFileName(fileExt);
    const fileSize = await fileUtils.getFileSize(url);
    if (fileSize > 5 * 1024 * 1024) {
      res.status(400).json({
        message: "File size exceeds 5MB",
      });
    }
    if (!fs.existsSync(path.join(__dirname, `../../downloads`))) {
      fs.mkdirSync(path.join(__dirname, `../../downloads`));
    }
    const localFilePath = path.join(__dirname, `../../downloads/${fileName}`);
    await fileUtils.downloadFileAndSaveToDestination(url, localFilePath);
    const cloudData = {
      fileName: fileName,
      localFilePath: localFilePath,
      id:`ran${randomInt(1000)}`,//update with database id
      codeUrl:url,
      uploadAddress:null
    }
    req.cloudData = cloudData;
    next();
  } catch (err) {
    res.status(400).json({
      message: "Invalid url or not downloadable",
    });
  }
};

module.exports = {
  fileUpload,
  uploadToCloud,
  populateSubmissionDb,
  addDownloadUrls,
  bringFileToLocal
};
