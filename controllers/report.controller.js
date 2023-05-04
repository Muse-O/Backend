const ReportService = require("../services/report.service");
// const reportSchema = require("../schemas/reportSchema")
const Boom = require("boom");

class ReportController {
  constructor() {
    this.reportService = new ReportService();
  }

  reportAll = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const {
        artgramId,
        reportEmail,
        exhibitionId,
        commentId,
        exhibitionReviewId,
        commentParent,
        reportMessage,
      } = req.body;

      const report = await this.reportService.reportAll(
        userEmail,
        artgramId,
        reportEmail,
        exhibitionId,
        commentId,
        exhibitionReviewId,
        commentParent,
        reportMessage
      );
      res.status(200).json({ report, message: "신고가 접수되었습니다." });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = ReportController;
