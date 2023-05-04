'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ChatRooms ChatMessages 1:N
      this.hasMany(models.ChatMessages, {
        sourceKey: 'chatRoomId',// 현재 모델의 chatRoomId 컬럼을
        foreignKey: 'chatRoomId'// ChatMessages 모델에 chatRoomId컬럼으로 연결합니다.
      })

      // ChatRooms ChatPaticipants 1:N
      this.hasMany(models.ChatParticipants, {
        sourceKey: 'chatRoomId',// 현재 모델의 chatRoomId 컬럼을
        foreignKey: 'chatRoomId'// ChatParticipants 모델에 chatRoomId컬럼으로 연결합니다.
      })
    }
  }
  ChatRooms.init({
    chatRoomId: { // 채팅방 ID
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'chat_room_id'
    },
    chatRoomSender: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'chat_room_creator'
    },
    chatRoomReceiver: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'chat_room_receiver'
    },
    chatRoomName: { // 채팅방 이름
      allowNull: false,
      type: DataTypes.STRING,
      field: 'chat_room_name'
    },
    chatRoomKind: { // 채팅방 종류(RK0001-1:1 비공개 채팅/RK0002-공개 채팅)
      allowNull: false,
      type: DataTypes.STRING,
      field: 'chat_room_kind'
    },
    chatRoomStatus: { // 채팅방 상태(RS0001-수신자 응답 승인/RS0002-수신자 응답 대기)
      allowNull: false,
      type: DataTypes.STRING,
      field: 'chat_room_status'
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
    modelName: 'ChatRooms',
    tableName: 'chat_rooms',
  });
  return ChatRooms;
};