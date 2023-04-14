'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exhibitions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.Users, {
        targetKey: 'userEmail', // Users 모델의 userEmail 컬럼을
        foreignKey: 'userEmail', // 현재 모델 userEmail가 외래키로 가지겠다.
        onDelete: "CASCADE",
      })
      this.hasOne(models.ExhibitionAddress, {
        sourceKey: "exhibitionId", // 현재 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // ExhibitionAddress 모델에 exhibitionId컬럼으로 연결합니다.
      });
      this.hasMany(models.ExhibitionCategory, {
        sourceKey: "exhibitionId", // 현재 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // ExhibitionCategory 모델에 exhibitionId컬럼으로 연결합니다.
      });
      this.hasMany(models.ExhibitionAuthor, {
        sourceKey: "exhibitionId", // 현재 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // ExhibitionAuthor 모델에 exhibitionId컬럼으로 연결합니다.
      });
      this.hasMany(models.ExhibitionImg, {
        sourceKey: "exhibitionId", // 현재 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // ExhibitionImg 모델에 exhibitionId컬럼으로 연결합니다.
      });
      this.hasMany(models.ExhibitionLike, {
        sourceKey: "exhibitionId", // 현재 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // ExhibitionLike 모델에 exhibitionId컬럼으로 연결합니다.
      });
      this.hasMany(models.ExhibitionScrap, {
        sourceKey: "exhibitionId", // 현재 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // ExhibitionScrap 모델에 exhibitionId컬럼으로 연결합니다.
      });
      this.hasMany(models.ExhibitionHashtag, {
        sourceKey: "exhibitionId", // 현재 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // ExhibitionHashtag 모델에 exhibitionId컬럼으로 연결합니다.
      });
      this.hasMany(models.ExhibitionReviews, {
        sourceKey: "exhibitionId", // 현재 모델의 exhibitionId 컬럼을
        foreignKey: "exhibitionId", // ExhibitionReview 모델에 exhibitionId컬럼으로 연결합니다.
      });
      
    }
  }
  Exhibitions.init({
    exhibitionId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      field: 'exhibition_id'
    },
    userEmail: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    exhibitionTitle: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'exhibition_title'
    },
    exhibitionEngTitle: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'exhibition_eng_title',
      defaultValue: 'not exhibitionEngTitle'
    },
    exhibitionDesc: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'exhibition_desc'
    },
    exhibitionKind: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'exhibition_kind'
    },
    exhibitionLink: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'exhibition_link'
    },
    exhibitionOnlineLink: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'exhibition_online_link'
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'start_date'
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'end_date'
    },
    openTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'open_time',
      defaultValue: '00:00:00'
    },
    closeTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'close_time',
      defaultValue: '00:00:00'
    },
    openDay: {
      type: DataTypes.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Weekdays'),
      allowNull: true,
      field: 'oepn_day',
      defaultValue: 'Weekdays'
    },
    closeDay: {
      type: DataTypes.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Weekdays'),
      allowNull: true,
      field: 'close_day',
      defaultValue: 'Weekdays'
    },
    entranceFee: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'entrance_fee',
      defaultValue: 'not written entrance fee'
    },
    postImage: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'post_image'
    },
    artWorkCnt: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'art_work_cnt',
      defaultValue: 'not written number of works'
    },
    contact: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'contact',
      defaultValue: 'not written contact'
    },
    agencyAndSponsor: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'agency_and_sponsor',
      defaultValue: 'not written agencyAndSponsor'
    },
    location: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'location'
    },
    exhibitionStatus: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'ES01',
      field: 'exhibition_status'
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
    modelName: 'Exhibitions',
    tableName: 'exhibitions'
  });
  return Exhibitions;
};