const { find } = require("lodash");
const {
  Users,
  ArticleReport,
  Exhibitions,
  Artgrams,
  ExhibitionReviews,
  ArtgramsComment,
} = require("../models");
const { Op } = require("sequelize");

class AdminRepository extends Users {
  constructor() {
    super();
  }

  getPendingExhibitions = async () => {
    const exhibitionApprove = await Exhibitions.findAll({
      attributes: [
        "exhibitionId",
        "userEmail",
        "exhibitionTitle",
        "exhibitionEngTitle",
        "exhibitionDesc",
        "postImage",
        "exhibitionStatus",
      ],
      where: { exhibitionStatus: "ES05" },
    });
    return exhibitionApprove;
  };

  approveExhibition = async (exhibitionId) => {
    const approval = await Exhibitions.update(
      {
        exhibitionStatus: "ES01",
      },
      {
        where: { exhibitionId },
      }
    );
    return approval;
  };

  getAllReports = async () => {
    const reports = await ArticleReport.findAll({});
    return reports;
  };

  processReportExhibition = async (filteredSelectId) => {
    const exhibitionId = filteredSelectId;
    const exhibition = await Exhibitions.findOne({
      where: { exhibitionId: exhibitionId },
    });
    const reportPost = await ArticleReport.update(
      {
        reportComplete: "clear",
      },
      {
        where: { exhibitionId: exhibitionId },
      }
    );
    const deleteReportedArticles = await Exhibitions.update(
      { exhibitionStatus: "ES04" },
      { where: { exhibitionId: exhibitionId } }
    );
    return exhibition;
  };

  processReportReview = async (filteredSelectId) => {
    const exhibitionReviewId = filteredSelectId[0];
    const exhibitionReview = await ExhibitionReviews.findOne({
      where: { exhibitionReviewId: exhibitionReviewId },
    });
    const reportPost = await ArticleReport.update(
      {
        reportComplete: "clear",
      },
      {
        where: { exhibitionReviewId: exhibitionReviewId },
      }
    );
    const deletePost = await ExhibitionReviews.update(
      { reviewStatus: "RS04" },
      { where: { exhibition_review_id: exhibitionReviewId } }
    );
    return exhibitionReview;
  };
  processReportArtgram = async (filteredSelectId) => {
    const artgramId = filteredSelectId[0];
    const artgram = await Artgrams.findOne({
      where: { artgramId: artgramId },
    });
    const reportPost = await ArticleReport.update(
      {
        reportComplete: "clear",
      },
      {
        where: { artgramId: artgramId },
      }
    );
    const deletePost = await Artgrams.update(
      { artgramStatus: "AS04" },
      { where: { artgramId: artgramId } }
    );
    return artgram;
  };
  processReportComment = async (filteredSelectId) => {
    const commentId = filteredSelectId[0];
    const comment = await ArtgramsComment.findOne({
      where: { commentId: commentId },
    });
    const reportPost = await ArticleReport.update(
      {
        reportComplete: "clear",
      },
      {
        where: { commentId: commentId },
      }
    );
    const deletePost = await ArtgramsComment.update(
      { commentStatus: "CS04" },
      { where: { commentId: commentId } }
    );
    return comment;
  };
  processReportCommentParent = async (filteredSelectId) => {
    const commentId = filteredSelectId[0];
    const commentParent = filteredSelectId[1];
    const cocoment = await ArtgramsComment.findOne({
      where: { commentId: commentId, commentParent: commentParent },
    });
    const reportPost = await ArticleReport.update(
      {
        reportComplete: "clear",
      },
      {
        where: { commentId: commentId },
      }
    );
    const deletePost = await ArtgramsComment.update(
      { commentStatus: "CS04" },
      { where: { commentId: commentId } }
    );
    return cocoment;
  };
  processReportUserEmail = async (filteredSelectId) => {
    const userEmail = filteredSelectId[0];
    const user = await Users.findOne({
      where: { userEmail: userEmail },
    });
    console.log("user", user);
    const reportPost = await ArticleReport.update(
      {
        reportComplete: "clear",
      },
      {
        where: { userEmail: userEmail },
      }
    );
    const deletePost = await Users.update(
      { userStatus: "US04" },
      { where: { userEmail: userEmail } }
    );
    return user;
  };
}

module.exports = AdminRepository;
