const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const AdminController = require("../controllers/admin.controller");
const adminController = new AdminController();

router.get(
  "/approvalList",
  authMiddleware,
  adminController.getPendingExhibitions
);
router.patch(
  "/approvalList",
  authMiddleware,
  adminController.approveExhibition
);
router.get("/reportList", authMiddleware, adminController.getAllReports);
router.patch("/reportList", authMiddleware, adminController.processReport);

module.exports = router;
