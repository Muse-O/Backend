'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExhibitionReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.ExhibitionHashtag, {
        sourceKey: "exhibitionReviewId", // 현재 모델의 exhibitionReviewId 컬럼을
        foreignKey: "exhibitionReviewId", // ExhibitionHashtag 모델에 exhibitionReviewId 연결합니다.
      });
      this.belongsTo(models.Exhibitions, {
        targetKey: "exhibitionId", // Exhibition 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // 현재 모델의 exhibitionId 외래키로 가진다.
        onDelete: "CASCADE",
      });
      this.belongsTo(models.Users, {
        targetKey: "userEmail", // Users 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // 현재 모델의 userEmail 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ExhibitionReview.init({
    exhibitionReviewId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'exhibition_review_id'
    },
    exhibitionId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'exhibition_id'
    },
    userEmail: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    reviewComment: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'review_comment'
    },
    reviewRating: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'review_rating'
    },
    reviewStatus: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'review_status',
      defaultValue: 'RS01'
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  }, {
    sequelize,
    modelName: 'ExhibitionReviews',
    tableName: 'exhibition_review'
  });
  return ExhibitionReview;
};