"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class searchHistory extends Model {
    static associate(models) {
      //Users Users N:1
      this.hasMany(models.Users, {
        targetKey: "userEmail", // 현재 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // ExhibitionReview 모델에 userEmail컬럼으로 연결합니다.
      });
    }
  }
  searchHistory.init(
    {
      searchId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        field: "search-id",
      },
      userEmail: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        field: "user_email",
      },
      keyWord: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "key-word",
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
      modelName: "searchHistory",
      tableName: "search_history",
    }
  );
  return searchHistory;
};
