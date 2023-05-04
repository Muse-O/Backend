const AdminService = require("../services/admin.service");
const logger = require("../middlewares/logger.js");

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  /**
   * 전시회 승인요청 리스트
   * ES5 전시회조회
   */
  getPendingExhibitions = async (req, res, next) => {
    try {
      const findApprovalList = await this.adminService.getPendingExhibitions();
      res.status(200).json({ findApprovalList });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 전시회 승인
   * ES05 -> ES01 로 변경
   * @param {exhibitionId} req.body
   */
  approveExhibition = async (req, res, next) => {
    try {
      const { exhibitionId } = req.body;
      const approved = await this.adminService.approveExhibition(exhibitionId);
      res.status(200).json({ message: "전시글이 승인되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 신고목록 조회
   * 신고DB 목록전체 조회
   * @param {userEmail} res.local.user
   */
  getAllReports = async (req, res, next) => {
    try {
      const reportList = await this.adminService.getAllReports();
      res.status(200).json({ reportList });
    } catch (err) {
      next(err);
    }
  };

  /**
   * 신고 처리
   * 처리되면 reportComplete => clear 로변경
   * @param {userEmail} res.local.user
   * @param {AllId} req.body
   */
  processReport = async (req, res, next) => {
    try {
      const {
        reportEmail,
        exhibitionId,
        exhibitionReviewId,
        artgramId,
        commentId,
        commentParent,
        articleType,
      } = req.body;
      const reportSuccess = await this.adminService.processReport(
        reportEmail,
        exhibitionId,
        exhibitionReviewId,
        artgramId,
        commentId,
        commentParent,
        articleType
      );
      res
        .status(200)
        .json({ reportSuccess, message: "신고글이 처리되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * "UR02"로 작가 권한부여
   */
  updateRole = async (req, res, next) => {
    try {
      const { approvingEmail } = req.body;
      const result = await this.adminService.updateRoleToAuthor(approvingEmail);

      return res.status(200).json({
        message: "작가 승인 처리되었습니다. userRole이 UR02로 변경되었습니다",
      });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };
  /**
   * "UR04"인 작가 승인대기자 명단조회
   */
  getPendingRoles = async (req, res, next) => {
    try {
      const pendingRoleList = await this.adminService.getPendingRoles();

      return res.status(200).json({ pendingRoleList });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };
}

module.exports = AdminController;
