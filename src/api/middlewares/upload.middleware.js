const multer = require("multer");

const storage = multer.memoryStorage(); // gunakan penyimpanan di memori (buffer)
const upload = multer({ storage });

const uploadMiddleware = upload.single("image"); // field name harus 'image'

module.exports = uploadMiddleware;
