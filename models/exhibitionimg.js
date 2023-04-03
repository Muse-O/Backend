'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExhibitionImg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Exhibitions, {
        targetKey: "exhibitionId", // Exhibition 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // 현재 모델의 exhibitionId 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ExhibitionImg.init({
    exhibitionImgId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'exhibition_img_id'
    },
    exhibitionId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'exhibition_id'
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
    imgCaption: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'img_caption'
    },
    isDelete: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      field: 'is_delete',
      defaultValue: false
    },
    isThumbnail: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      field: 'is_thumbnail',
      defaultValue: false
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'ExhibitionImg',
    tableName: 'exhibition_img'
  });
  return ExhibitionImg;
};