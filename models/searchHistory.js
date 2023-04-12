"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class searchHistory extends Model {
    static associate(models) {}
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
      keyWord: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "key-word",
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
