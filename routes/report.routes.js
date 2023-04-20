const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const ReportController = require("../controllers/report.controller");
const reportController = new ReportController();

router.post("/", authMiddleware, reportController.reportAll);

module.exports = router;
