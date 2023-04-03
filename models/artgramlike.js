'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArtgramLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: "userEmail", // Users 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // 현재 모델의 userEmail가 외래키로 가진다.
        onDelete: "CASCADE",
      });
      this.belongsTo(models.Artgrams, {
        targetKey: "artgramId", // Artgrams 모델의 artgramId 컬럼을
        foreignKey: "artgramId", // 현재 모델의 artgramId가 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ArtgramLike.init({
    artgramLikeId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'artgram_like_id'
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
  }, {
    sequelize,
    modelName: 'ArtgramLike',
    tableName: 'artgram_like',
    uniqueKeys: {
      artgramLikeKey: {
        fields: ['artgram_id', 'user_email'],
      }
    }
  });
  return ArtgramLike;
};