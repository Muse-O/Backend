const ReportRepository = require("../repositories/report.repository");
const Boom = require("boom");

const targetTypeMap = {
  artgram: "artgram",
  exhibition: "exhibition",
  comment: "comment",
  exhibitionReview: "exhibitionReview",
  reportEmail: "userEmail",
};

class ReportService {
  constructor() {
    this.reportRepository = new ReportRepository();
  }

  /**
   * 신고대상 id검증
   * @param {body} userEmail
   * @param {body} artgramId
   * @param {body} exhibitionId
   * @param {body} commentId
   * @param {body} exhibitionReviewId
   * @param {body} commentParent
   * @param {body} reportMessage
   * @returns
   */
  reportAll = async (
    userEmail,
    artgramId,
    reportEmail,
    exhibitionId,
    commentId,
    exhibitionReviewId,
    commentParent,
    reportMessage
  ) => {
    let target;
    let targetType;
    if (commentId && commentParent) {
      target = await this.reportRepository.saveCommentParent(
        commentId,
        commentParent,
        userEmail,
        reportEmail,
        reportMessage
      );
      console.log(target);
    } else {
      if (artgramId) {
        targetType = targetTypeMap.artgram;
        target = await this.reportRepository.findArtgramById(artgramId);
      } else if (exhibitionId) {
        targetType = targetTypeMap.exhibition;
        target = await this.reportRepository.findExhibitionById(exhibitionId);
      } else if (commentId) {
        targetType = targetTypeMap.comment;
        target = await this.reportRepository.findCommentById(commentId);
      } else if (exhibitionReviewId) {
        targetType = targetTypeMap.exhibitionReview;
        target = await this.reportRepository.findExhibitionReviewById(
          exhibitionReviewId
        );
      } else if (reportEmail) {
        targetType = targetTypeMap.reportEmail;
        tatget = await this.reportRepository.findReportUserId(reportEmail);
      }
    }
    if (!target) {
      throw Boom.notFound("신고할 대상이 존재하지 않습니다.");
    }
    const report = await this.reportRepository.saveReport(
      userEmail,
      targetType,
      target,
      reportMessage
    );

    return report;
  };
}

module.exports = ReportService;
