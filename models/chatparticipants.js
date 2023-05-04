'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatParticipants extends Model {
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

      this.belongsTo(models.ChatRooms, {
        targetKey: "chatRoomId", // ChatRooms 모델의 chatRoomId 컬럼을
        foreignKey: "chatRoomId", // 현재 모델의 chatRoomId 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ChatParticipants.init({
    participantId: { // 참여자 ID
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'participant_id'
    },
    userEmail: { // 참여자 이메일 - FK
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    chatRoomId: { // 채팅방 ID - FK
      allowNull: false,
      type: DataTypes.UUID,
      field: 'chat_room_id'
    },
    chatRoomRole: { // 채팅방내 역할 CR0001 - 최초 송신자 / CR0002 - 최초 수신자
      allowNull: false,
      type: DataTypes.STRING,
      field: 'chat_room_role'
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
    modelName: 'ChatParticipants',
    tableName: 'chat_participants',
  });
  return ChatParticipants;
};