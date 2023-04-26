"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SearchHistory extends Model {
    static associate(models) {
      //Users Users N:1
      this.belongsTo(models.Users, {
        targetKey: "userEmail", // Users 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // 현재 모델의 userEmail 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  SearchHistory.init(
    {
      searchId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        field: "search_id",
      },
      userEmail: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "user_email",
      },
      keyWord: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "key_word",
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "type",
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
    },
    {
      sequelize,
      modelName: "SearchHistory",
      tableName: "search_history",
    }
  );
  return SearchHistory;
};
