'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommonCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CommonCodes.init({
    codeId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'code_id'
    },
    codeUseTable: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'code_use_table'
    },
    codeUseColumn: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'code_use_column'
    },
    codeGroupValue: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'code_group_value'
    },
    codeValue: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'code_value'
    },
    codeMean: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'code_mean'
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
    modelName: 'CommonCodes',
    tableName: 'common_codes'
  });
  return CommonCodes;
};