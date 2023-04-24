"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArtgramHashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Artgrams, {
        targetKey: "artgramId", // Artgrams 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // 현재 모델의 artgramId가 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ArtgramHashtag.init(
    {
      artgramTagId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        field: "artgram_tag_id",
      },
      artgramId: {
        allowNull: false,
        type: DataTypes.UUID,
        field: "artgram_id",
      },
      tagName: {
        allowNull: true,
        type: DataTypes.STRING,
        field: "tag_name",
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
      modelName: "ArtgramHashtag",
      tableName: "artgram_hashtag",
    }
  );
  return ArtgramHashtag;
};
