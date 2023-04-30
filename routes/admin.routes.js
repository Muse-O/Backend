const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const AdminController = require("../controllers/admin.controller");
const adminController = new AdminController();

/**
 * @swagger
 * /admin/approvalList:
 *   get:
 *     tags:
 *       - admin
 *     summary: 전시회 승인요청 목록 조회
 *     responses:
 *       200:
 *         description: 전시회 승인되지 않은 목록을 조회합니다.
 *     security:
 *       - jwt: []
 *   patch:
 *     tags:
 *       - admin
 *     summary: 전시회 승인
 *     parameters:
 *      - name: exhibitionId
 *        in: path
 *        description: 전시회id값을 기준으로 전시회승인처리
 *     responses:
 *       200:
 *         description: 미승인 전시회를 승인 처리했습니다.
 *     security:
 *       - jwt: []
 * /admin/reportList:
 *   get:
 *     tags:
 *       - admin
 *     summary: 신고처리 목록 조회
 *     responses:
 *       200:
 *         description: 신고처리된 목록을 조회합니다.
 *     security:
 *       - jwt: []
 *   patch:
 *     tags:
 *       - admin
 *     summary: 신고처리된 요청 승인
 *     parameters:
 *      - name: reportEmail
 *        in: path
 *        description: 신고된 유저의 email을 삭제처리합니다.
 *      - name: exhibitionId
 *        in: path
 *        description: 신고된 유저의 exhibitionId를 삭제처리합니다.
 *      - name: exhibitionReviewId
 *        in: path
 *        description: 신고된 유저의 exhibitionReviewId를 삭제처리합니다.
 *      - name: artgramId
 *        in: path
 *        description: 신고된 유저의 artgramId을 삭제처리합니다.
 *      - name: commentId
 *        in: path
 *        description: 신고된 유저의 commentId을 삭제처리합니다.
 *      - name: commentParent
 *        in: path
 *        description: 신고된 유저의 commentParent을 삭제처리합니다. commentId값도 같이필요함.
 *      - name: articleType
 *        in: path
 *        description: 전시회RP000001, 전시회리뷰RP000002, 아트그램RP000003, 아트그램댓글RP000004, 아트그램답글RP000005, 유저RP000006
 *     responses:
 *       200:
 *         description: 신고처리된 요청을 승인합니다.
 *     security:
 *       - jwt: []
 */

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

// router.patch("/role", adminController.updateRole)

// router.get("/role", adminController.getPendingRoles)

module.exports = router;
