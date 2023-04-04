"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Artgrams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.ArtgramAddress, {
        sourceKey: "artgramId", // 현재 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // ArtgramAddress 모델의 artgramId가 외래키로 가진다.
      });
      this.hasMany(models.ArtgramHashtag, {
        sourceKey: "artgramId", // 현재 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // ArtgramHashtag 모델의 artgramId가 외래키로 가진다.
      });
      this.hasMany(models.ArtgramImg, {
        sourceKey: "artgramId", // 현재 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // ArtgramImg 모델의 artgramId 외래키로 가진다.
      });
      this.hasMany(models.ArtgramLike, {
        sourceKey: "artgramId", // 현재 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // ArtgramLike 모델의 artgramId 외래키로 가진다.
      });
      this.hasMany(models.ArtgramsComment, {
        sourceKey: "artgramId", // 현재 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // ArtgramsComment 모델의 artgramId 외래키로 가진다.
      });
      this.hasMany(models.ArtgramScrap, {
        sourceKey: "artgramId", // 현재 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // ArtgramScrap 모델의 artgramId 외래키로 가진다.
      });
      this.hasMany(models.ArticleReport, {
        sourceKey: "artgramId", // 현재 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // ArticleReport 모델의 artgramId 외래키로 가진다.
      });
      this.belongsTo(models.Users, {
        sourceKey: "userEmail", // Users 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // 현재 모델의 userEmail이 외래키로 가진다.
      });
    }
  }
  Artgrams.init(
    {
      artgramId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        field: "artgram_id",
      },
      userEmail: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "user_email",
      },
      artgramTitle: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "artgram_title",
      },
      artgramDesc: {
        allowNull: true,
        type: DataTypes.STRING,
        field: "artgram_desc",
      },
      artgramStatus: {
        allowNull: true,
        type: DataTypes.STRING,
        field: "artgram_status",
        defaultValue: "AS01",
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
      modelName: "Artgrams",
      tableName: "artgrams",
    }
  );
  return Artgrams;
};
