'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArtgramsComment extends Model {
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
    }
  }
  ArtgramsComment.init({
    commentId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'comment_id'
    },
    artgramId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'artgram_id'
    },
    userEmail: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    comment: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'comment'
    },
    commentParent: {
      allowNull: true,
      type: DataTypes.UUID,
      field: 'comment_parent'
    },
    commentStatus: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'comment_status',
      defaultValue: 'CS01'
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
    modelName: 'ArtgramsComment',
    tableName: 'artgram_comment'
  });
  return ArtgramsComment;
};