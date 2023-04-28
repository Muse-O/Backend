"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArticleReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: "userEmail", // Users 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // 현재 모델의 userEmail 외래키로 가진다.
        onDelete: "CASCADE",
      });
      this.belongsTo(models.Artgrams, {
        targetKey: "artgramId", // Artgrams 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // 현재 모델의 artgramId 외래키로 가진다.
        onDelete: "CASCADE",
      });
      this.belongsTo(models.Exhibitions, {
        targetKey: "exhibitionId", // Exhibitions 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // 현재 모델의 exhibitionId 외래키로 가진다.
        onDelete: "CASCADE",
      });
      this.belongsTo(models.ExhibitionReviews, {
        targetKey: "exhibitionReviewId", // ExhibitionReview 모델의 exhibitionReviewId 컬럼을
        foreignKey: "exhibitionReviewId", // 현재 모델의 exhibitionReviewId 외래키로 가진다.
        onDelete: "CASCADE",
      });
      this.belongsTo(models.ArtgramsComment, {
        targetKey: "commentId", // ArtgramsComment 모델의 commentId 컬럼을
        foreignKey: "commentId", // 현재 모델의 commentId 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ArticleReport.init(
    {
      reportId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        field: "report_id",
      },
      userEmail: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "user_email",
      },
      artgramId: {
        allowNull: true,
        type: DataTypes.UUID,
        field: "artgram_id",
      },
      exhibitionId: {
        allowNull: true,
        type: DataTypes.UUID,
        field: "exhibition_id",
      },
      exhibitionReviewId: {
        allowNull: true,
        type: DataTypes.UUID,
        field: "exhibition_review_id",
      },
      commentParent: {
        allowNull: true,
        type: DataTypes.UUID,
        field: "comment_parent",
      },
      commentId: {
        allowNull: true,
        type: DataTypes.UUID,
        field: "comment_id",
      },
      reportEmail: {
        allowNull: true,
        type: DataTypes.STRING,
        field: "report_email",
      },
      articleType: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "article_type",
      },
      reportMessage: {
        allowNull: true,
        type: DataTypes.STRING,
        field: "report_message",
      },
      reportComplete: {
        allowNull: true,
        type: DataTypes.STRING,
        field: "report_complete",
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "ArticleReport",
      tableName: "article_report",
    }
  );
  return ArticleReport;
};
