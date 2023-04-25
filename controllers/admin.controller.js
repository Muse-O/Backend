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
      const { exhibitionId } = res.body;
      const approved = await this.adminService.approveExhibition(
        userEmail,
        exhibitionId
      );
      res.status(200).json({ approved });
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
      const reportSuccess = await this.adminService.processReport(userEmail);
      res.status(200).json({ reportSuccess });
    } catch (err) {
      next(err);
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
