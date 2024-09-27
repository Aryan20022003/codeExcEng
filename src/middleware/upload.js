const multer = require('multer');
const nameUtils=require('../../utils/fileName')
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads'); 
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, nameUtils.uniqueFileName(path.extname(file.originalname)));
  }
});

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
  fileFilter: (req, file, cb) => {
    // Only allow C++, Java, Python files
    const filetypes = /cpp|java|py/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'text/x-c' || file.mimetype === 'text/x-java' || file.mimetype === 'text/x-python' || extname;

    if (mimetype && extname) {
      console.log(`file upload successfully`);
      return cb(null, true);
    } else {
      cb(new Error('Only C++, Java, and Python files are allowed'));
    }
  }
});

const bucketUpload=(req,resp)=>{
    console.log("bucket upload begins....",req.file);
    resp.status(200).send('Uploaded');
}


module.exports = {
  fileUpload,
};


// // POST route for file upload
// app.post('/upload', upload.single('sourceFile'), (req, res) => {
//   try {
//     // File successfully uploaded
//     console.log(req.file); // Logs the file details to the console
//     res.send('File uploaded successfully');
//   } catch (err) {
//     res.status(400).send('Error uploading file');
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
