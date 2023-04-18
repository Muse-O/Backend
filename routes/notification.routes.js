const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const NotiController = require("../controllers/notification.controller");
const notiController = new NotiController();

router.get("/", authMiddleware, notiController.getNotiList);
router.get("/count", authMiddleware, notiController.getNotiCount);
router.patch("/", authMiddleware, notiController.confirmNoti);
router.post("/", authMiddleware, notiController.postNoti);

module.exports = router;



