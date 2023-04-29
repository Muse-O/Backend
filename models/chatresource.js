'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatResources extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.ChatMessages, {
        targetKey: "messageId", // Users 모델의 userEmail 컬럼을
        foreignKey: "messageId", // 현재 모델의 userEmail 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ChatResources.init({
    chatResourceId: { // 채팅 메시지 리소스(이미지 등) ID
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'chat_resource_id'
    },
    messageId: { // 메시지 ID - FK
      allowNull: false,
      type: DataTypes.UUID,
      field: 'message_id'
    },
    chatResourceUrl: { // 리소스 URL
      allowNull: false,
      type: DataTypes.STRING,
      field: 'chat_resource_url'
    },
    chatResoureceOrder: { // 메시지내 리소스 순서
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'chat_resource_order'
    },
    createdAt: { // 생성 시간
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: { // 수정 시간
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'update_at',
    }
  }, {
    sequelize,
    modelName: 'ChatResources',
    tableName: 'chat_resources',
  });
  return ChatResources;
};