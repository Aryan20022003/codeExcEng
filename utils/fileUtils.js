const { bucket } = require("../config/firebase");
const fs = require("fs");

const mimeTypeMap = {
  cpp: "text/x-c++src",
  java: "text/x-java-source",
  py: "text/x-python",
};

const uploadFileToBucket = async (
  localFilePath,
  destinationFilePath,
  metaData
) => {
  const fileStream = fs.createReadStream(localFilePath);
  const file = bucket.file(destinationFilePath);
  console.log(metaData.extension, mimeTypeMap[metaData.extension]);
  const options = {
    metadata: {
      contentType: mimeTypeMap[`${metaData.extension}`],
      metadata: { ...metaData },
    },
  };

  return new Promise((resolve, reject) => {
    fileStream
      .pipe(file.createWriteStream(options))
      .on("finish", () =>
        resolve(`File uploaded successfully to ${destinationFilePath}`)
      )
      .on("error", (error) => reject(error));
  });
};

const downloadFileAndSaveToDestination=async(url, directory, fileName)=>{
  try {
    // Ensure the directory exists
    fs.mkdir(directory, { recursive: true });

    const filePath = path.join(directory, fileName);
    const fileStream = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file: ${response.statusCode}`));
          return;
        }

        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`File downloaded successfully: ${filePath}`);
          resolve();
        });
      }).on('error', reject);

      fileStream.on('error', reject);
    });

    return filePath;
  } catch (error) {
    await fs.unlink(filePath).catch(() => {}); // Delete the file if there's an error
    throw error;
  }
}

const signedUrl = async (filePathBucket, hoursToLive = 0.5) => {
  const file = bucket.file(filePathBucket);
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + hoursToLive * 60 * 60 * 1000,
  };

  return file.getSignedUrl(options);
};

//TODO: Implement the downloadFile function
const downLoadFileFromBucket = {};

module.exports = {
  uploadFileToBucket,
  signedUrl,
  mimeTypeMap,
  downLoadFileFromBucket,
};
