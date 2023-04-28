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

  processReport = async (
    userEmail,
    reportEmail,
    exhibitionId,
    exhibitionReviewId,
    artgramId,
    commentId,
    commentParent,
    articleType
  ) => {
    const findAdmin = await adminPermission(userEmail);
    if (findAdmin !== "UR03") {
      throw Boom.notFound("관리자아이디로만 접근이 가능합니다.");
    }

    const selectId = [
      reportEmail,
      exhibitionId,
      exhibitionReviewId,
      artgramId,
      commentId,
      commentParent,
    ];
    const filteredSelectId = selectId.filter((value) => {
      return value !== undefined;
    });
    if (articleType === "RP000001") {
      const report = await this.adminRepository.processReportExhibition(
        filteredSelectId
      );

      if (!report) {
        throw Boom.notFound("존재하지 않는 전시회입니다.");
      }
      return report;
    } else if (articleType === "RP000002") {
      const report = await this.adminRepository.processReportReview(
        filteredSelectId
      );
      if (!report) {
        throw Boom.notFound("존재하지 않는 리뷰입니다.");
      }
      return report;
    } else if (articleType === "RP000003") {
      const report = await this.adminRepository.processReportArtgram(
        filteredSelectId
      );
      if (!report) {
        throw Boom.notFound("존재하지 않는 아트그램입니다.");
      }
      return report;
    } else if (articleType === "RP000004") {
      const report = await this.adminRepository.processReportComment(
        filteredSelectId
      );
      if (!report) {
        throw Boom.notFound("존재하지 않는 댓글입니다.");
      }
      return report;
    } else if (articleType === "RP000005") {
      if (filteredSelectId.length !== 2) {
        throw Boom.notFound("댓글과 답글의 아이디값이 모두 필요합니다.");
      }
      const report = await this.adminRepository.processReportCommentParent(
        filteredSelectId
      );
      if (!report) {
        throw Boom.notFound("존재하지 않는 답글입니다.");
      }
      return report;
    } else if (articleType === "RP000006") {
      const report = await this.adminRepository.processReportUserEmail(
        filteredSelectId
      );
      if (!report) {
        throw Boom.notFound("존재하지 않는 유저입니다.");
      }
      return report;
    } else {
      throw new Error("삭제할 게시글이 존재하지 않습니다.");
    }
  };
}

module.exports = AdminService;
