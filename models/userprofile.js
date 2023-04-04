"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");

const crypto = require("crypto");
const randomHex = crypto.randomBytes(5).toString("hex");

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.Users, {
        targetKey: "userEmail", // Users 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // 현재 모델 userEmail가 외래키로 가지겠다.
      });
    }
  }
  UserProfile.init(
    {
      profileId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        field: "profile_id",
      },
      userEmail: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "user_email",
      },
      profileNickname: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: `MUSE${randomHex}`,
        field: "profile_nickname",
      },
      profileImg: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue:
          "https://avatars.githubusercontent.com/u/51357635?s=400&u=36fd01b69ccd7729620c086927f9c0847ffdb0e1&v=4",
        field: "profile_img",
      },
      profileIntro: {
        allowNull: true,
        type: DataTypes.STRING,
        field: "profile_intro",
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
      modelName: "UserProfile",
      tableName: "user_profile",
    }
  );
  return UserProfile;
};
