const multer = require("multer");

// Set up multer middleware with storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${file.originalname}.${extension}`);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
