const AdminRepository = require("../repositories/admin.repository");
const adminPermission = require("../modules/findAdmin");
const Boom = require("boom");

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  getPendingExhibitions = async (userEmail) => {
    const findAdmin = await adminPermission(userEmail);
    if (findAdmin !== "UR03") {
      throw Boom.notFound("관리자아이디로만 접근이 가능합니다.");
    }
    const approvalRequestList =
      await this.adminRepository.getPendingExhibitions();
    return approvalRequestList;
  };

  approveExhibition = async (userEmail, exhibitionId) => {
    const findAdmin = await adminPermission(userEmail);
    if (findAdmin !== "UR03") {
      throw Boom.notFound("관리자아이디로만 접근이 가능합니다.");
    }
    const exhibitionApproval = await this.adminRepository.approveExhibition(
      exhibitionId
    );
    return exhibitionApproval;
  };

  getAllReports = async (userEmail) => {
    const findAdmin = await adminPermission(userEmail);
    if (findAdmin !== "UR03") {
      throw Boom.notFound("관리자아이디로만 접근이 가능합니다.");
    }
    const reportList = await this.adminRepository.getAllReports();
    return reportList;
  };

  processReport = async (userEmail) => {
    const findAdmin = await adminPermission(userEmail);
    if (findAdmin !== "UR03") {
      throw Boom.notFound("관리자아이디로만 접근이 가능합니다.");
    }
    const report = await this.adminRepository.processReport();
    return report;
  };
}

module.exports = AdminService;
