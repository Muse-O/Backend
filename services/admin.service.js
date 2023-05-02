const AdminRepository = require("../repositories/admin.repository");
const MypageRepository = require("../repositories/mypage.repository");
const adminPermission = require("../modules/findAdmin");
const Boom = require("boom");
const { ScanStream } = require("ioredis");

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
    this.mypageRepository = new MypageRepository();
  }

  getPendingExhibitions = async () => {
    const approvalRequestList =
      await this.adminRepository.getPendingExhibitions();
    return approvalRequestList;
  };

  approveExhibition = async (exhibitionId) => {
    const exhibitionApproval = await this.adminRepository.approveExhibition(
      exhibitionId
    );
    return exhibitionApproval;
  };

  getAllReports = async () => {
    const reportList = await this.adminRepository.getAllReports();
    return reportList;
  };

  processReport = async (
    reportEmail,
    exhibitionId,
    exhibitionReviewId,
    artgramId,
    commentId,
    commentParent,
    articleType
  ) => {
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

  /**
   * "UR02"로 작가 권한부여
   * @param {*} approvingEmail 승인처리할 사용자 이메일
   * @returns
   */
  updateRoleToAuthor = async (approvingEmail) => {
    const beforeRole = await this.mypageRepository.findUserRoleByEmail(
      approvingEmail
    );
    if (beforeRole == "UR02") {
      throw Boom.badRequest("이미 작가 승인 처리되어 있는 ID입니다.");
    }
    await this.adminRepository.updateRoleToAuthor(approvingEmail);
  };

  /**
   * "UR04"인 작가 승인대기자 명단조회
   * @returns 작가 승인대기자 명단
   */
  getPendingRoles = async () => {
    const pendingList = await this.adminRepository.getPendingRoles();
    return pendingList;
  };
}

module.exports = AdminService;
