'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExhibitionHashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
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
      this.belongsTo(models.ExhibitionReviews, {
        targetKey: "exhibitionReviewId", // ExhibitionReviews 모델의 exhibitionReviewId 컬럼을
        foreignKey: "exhibitionReviewId", // 현재 모델의 exhibitionReviewId 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ExhibitionHashtag.init({
    exhibitionTagId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'exhibition_tag_id'
    },
    exhibitionId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'exhibition_id'
    },
    exhibitionReviewId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'exhibition_review_id'
    },
    userEmail: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    tagName: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'tag_name'
    },
    isUse: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'Y',
      field: 'is_use'
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
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'ExhibitionHashtag',
    tableName: 'exhibition_hashtag'
  });
  return ExhibitionHashtag;
};