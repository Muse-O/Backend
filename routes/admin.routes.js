const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const AdminController = require("../controllers/admin.controller");
const adminController = new AdminController();

router.get("/admin/approvalList", adminController.getPendingExhibitions);
router.patch("/admin/approvalList", adminController.approveExhibition);
router.get("/admin/reportList", adminController.getAllReports);
router.patch("/admin/reportList", adminController.processReport);

module.exports = router;
