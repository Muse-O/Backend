const multer = require("multer");

// Set up multer middleware with storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filenameImage: function (req, file, cb) {
    // cb(null, Date.now() + "-" + file.originalname);
    cb(null, file.originalname + ".png");
  },
});
const upload = multer({ storage: storage });

module.exports = { upload };
