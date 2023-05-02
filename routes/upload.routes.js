const express = require("express");
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const UploadController = require("../controllers/upload.controller")
const uploadController = new UploadController();

// CLOUDFLARE IMAGES URL 요청
router.get("/", authMiddleware, uploadController.getImageUploadUrl);

module.exports = router;