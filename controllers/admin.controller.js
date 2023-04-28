const AdminService = require("../services/admin.service");

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  getPendingExhibitions = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const findApprovalList = await this.adminService.getPendingExhibitions(
        userEmail
      );
      res.status(200).json({ findApprovalList });
    } catch (err) {
      next(err);
    }
  };

  approveExhibition = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { exhibitionId } = req.body;
      console.log("exhibitionId", exhibitionId);
      const approved = await this.adminService.approveExhibition(
        userEmail,
        exhibitionId
      );
      res.status(200).json({ message: "전시글이 승인되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  getAllReports = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const reportList = await this.adminService.getAllReports(userEmail);
      res.status(200).json({ reportList });
    } catch (err) {
      next(err);
    }
  };

  processReport = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const {
        reportEmail,
        exhibitionId,
        exhibitionReviewId,
        reportUserEmail,
        artgramId,
        commentId,
        commentParent,
        articleType,
      } = req.body;
      const reportSuccess = await this.adminService.processReport(
        userEmail,
        reportEmail,
        exhibitionId,
        exhibitionReviewId,
        reportUserEmail,
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

  //   exhibitionApproval = async(req, res, next) => {
  //     try{

  //     }catch(err){
  //         next(err)
  //     }
  //   }

  //   exhibitionApproval = async(req, res, next) => {
  //     try{

  //     }catch(err){
  //         next(err)
  //     }
  //   }
}

module.exports = AdminController;
