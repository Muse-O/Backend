'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArtgramScrap extends Model {
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
  ArtgramScrap.init({
    artgramScrapId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'artgram_scrap_id'
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
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'ArtgramScrap',
    tableName: 'artgram_scrap',
    uniqueKeys: {
      artgramLikeKey: {
        fields: ['artgram_id', 'user_email'],
      }
    }
  });
  return ArtgramScrap;
};