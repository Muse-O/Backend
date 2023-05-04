'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Alarms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: "userEmail", // Users 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // 현재 모델의 userEmail이 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  } 
  Alarms.init({
    alarmId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'alarm_id'
    },
    userEmail: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    alarmSender: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'alarm_sender'
    },
    alarmReceiver: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'alarm_receiver'
    },
    alarmContent: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'alarm_content'
    },
    alarmStatus: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'MS01',
      field: 'alarm_status'
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
    modelName: 'Alarms',
    tableName: 'alarms'
  });
  return Alarms;
};