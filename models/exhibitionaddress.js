'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExhibitionAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExhibitionAddress.init({
    addressId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'address_id'
    },
    exhibitionId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'exhibition_id'
    },
    zonecode: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'zonecode'
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'address'
    },
    addressEnglish: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'address_english'
    },
    addressType: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'address_type'
    },
    buildingName: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'building_name'
    },
    buildingCode: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'building_code'
    },
    roadAddress: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'road_address'
    },
    roadAddressEnglish: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'road_address_english'
    },
    autoJibunAddress: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'auto_jibun_address'
    },
    autoJibunAddressEnglish: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'auto_jibun_address_english'
    },
    roadname: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'roadname'
    },
    roadnameCode: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'roadname_code'
    },
    roadnameEnglish: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'roadname_english'
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
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'ExhibitionAddress',
    tableName: 'exhibition_address',
  });
  return ExhibitionAddress;
};