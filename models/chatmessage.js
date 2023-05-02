'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatMessages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ChatMessages ChatResources 1:N
      this.hasMany(models.ChatResources, {
        sourceKey: 'messageId',// 현재 모델의 messageId 컬럼을
        foreignKey: 'messageId'// ChatResources 모델에 messageId컬럼으로 연결합니다.
      })

      this.belongsTo(models.Users, {
        targetKey: "userEmail", // Users 모델의 userEmail 컬럼을
        foreignKey: "userEmail", // 현재 모델의 userEmail 외래키로 가진다.
        onDelete: "CASCADE",
      });

      this.belongsTo(models.ChatRooms, {
        targetKey: "chatRoomId", // ChatRooms 모델의 chatRoomId 컬럼을
        foreignKey: "chatRoomId", // 현재 모델의 chatRoomId 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ChatMessages.init({
    messageId: { // 메시지 ID
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'message_id'
    },
    chatRoomId: { // 채팅방 ID - FK
      allowNull: false,
      type: DataTypes.UUID,
      field: 'chat_room_id'
    },
    userEmail: { // 채팅 메시지 작성자 이메일 - FK
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    messageContent: { // 채팅 메시지
      allowNull: false,
      type: DataTypes.STRING,
      field: 'message_content'
    },
    messageStatus: { // 메시지 상태 (MS0001-활성/MS0002-삭제)
      allowNull: false,
      type: DataTypes.STRING,
      field: 'message_status'
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
    modelName: 'ChatMessages',
    tableName: 'chat_messages',
  });
  return ChatMessages;
};