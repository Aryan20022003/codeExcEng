const bucketUpload = (req, resp) => {
  console.log("bucket upload begins....", req.file);
  resp.status(200).send("Uploaded");
};

module.exports = {
  bucketUpload,
};
