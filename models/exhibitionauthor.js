'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExhibitionAuthor extends Model {
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
  ExhibitionAuthor.init({
    authorId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'author_id'
    },
    exhibitionId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'exhibition_id'
    },
    authorName: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'author_name'
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
  }, {
    sequelize,
    modelName: 'ExhibitionAuthor',
    tableName: 'exhibition_author'
  });
  return ExhibitionAuthor;
};