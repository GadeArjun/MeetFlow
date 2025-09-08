const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory for direct Cloudinary upload
const upload = multer({ storage });

exports.upload = upload;
