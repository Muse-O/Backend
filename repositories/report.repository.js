const {
  Artgrams,
  Exhibitions,
  ArtgramsComment,
  ExhibitionReview,
  ArticleReport,
} = require("../models");

class ReportRepository {
  constructor() {
    this.articleReportModel = ArticleReport;
  }

  findArtgramById = async (artgramId) => {
    const targetA = await Artgrams.findOne({
      where: { artgramId: artgramId },
      attributes: ["artgramId"],
    });
    return targetA.dataValues.artgramId;
  };

  findExhibitionById = async (exhibitionId) => {
    const targetE = await Exhibitions.findOne({
      where: { exhibitionId },
      attributes: ["exhibitionId"],
    });
    return targetE.dataValues.exhibitionId;
  };

  findCommentById = async (commentId) => {
    const targetC = await ArtgramsComment.findOne({
      where: { commentId },
      attributes: ["commentId"],
    });
    return targetC.dataValues.commentId;
  };

  findExhibitionReviewById = async (exhibitionReviewId) => {
    const targetR = await ExhibitionReview.findOne({
      where: { exhibitionReviewId },
      attributes: ["exhibitionReviewId"],
    });
    return targetR.dataValues.exhibitionReviewId;
  };

  saveCommentParent = async (
    commentId,
    commentParent,
    userEmail,
    reportMessage
  ) => {
    const targetP = await this.articleReportModel.create({
      commentParent,
      commentId,
      userEmail,
      reportMessage,
      articleType: "RP000005",
    });
    return targetP.dataValues.commentParent;
  };

  saveReport = async (userEmail, targetType, target, reportMessage) => {
    console.log(userEmail, targetType, target, reportMessage);
    let savedReport;
    if (targetType === "artgram") {
      savedReport = await this.articleReportModel.create({
        userEmail,
        reportMessage,
        artgramId: target,
        articleType: "RP000003",
      });
    } else if (targetType === "exhibition") {
      savedReport = await this.articleReportModel.create({
        userEmail,
        reportMessage,
        exhibitionId: target,
        articleType: "RP000001",
      });
    } else if (targetType === "exhibitionReview") {
      savedReport = await this.articleReportModel.create({
        userEmail,
        reportMessage,
        exhibitionReviewId: target,
        articleType: "RP000002",
      });
    } else if (targetType === "comment") {
      savedReport = await this.articleReportModel.create({
        userEmail,
        reportMessage,
        commentId: target,
        articleType: "RP000004",
      });
    } else if (targetType === "userEmail") {
      savedReport = await this.articleReportModel.create({
        userEmail,
        reportMessage,
        reportEmail: target,
        articleType: "RP000006",
      });
    }
    return savedReport;
  };
}

module.exports = ReportRepository;
