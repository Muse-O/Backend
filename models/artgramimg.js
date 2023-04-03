'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArtgramImg extends Model {
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
  ArtgramImg.init({
    artgramImgId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'artgram_img_id'
    },
    artgramId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'artgram_id'
    },
    imgOrder: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'img_order',
      defaultValue: 1
    },
    imgUrl: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'img_url'
    },
    isDelete: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      field: 'is_delete',
      defaultValue: false
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
    }
  }, {
    sequelize,
    modelName: 'ArtgramImg',
    tableName: 'artgram_img'
  });
  return ArtgramImg;
};