'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Users UserProfile 1:1
      this.hasOne(models.UserProfile, {
        sourceKey: 'userEmail', // 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail' // UserProfile 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users Alarms 1:N
      this.hasMany(models.Alarms, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// Alarms 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users Artgrams 1:N
      this.hasMany(models.Artgrams, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// Artgrams 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users ArtgramLike 1:N
      this.hasMany(models.ArtgramLike, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// ArtgramLike 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users ArtgramScrap 1:N
      this.hasMany(models.ArtgramScrap, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// ArtgramScrap 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users ArtgramsComment 1:N
      this.hasMany(models.ArtgramsComment, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// ArtgramsComment 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users ArticleReport 1:N
      this.hasMany(models.ArticleReport, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// ArticleReport 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users Exhibitions 1:N
      this.hasMany(models.Exhibitions, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// Exhibitions 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users ExhibitionLike 1:N
      this.hasMany(models.ExhibitionLike, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// ExhibitionLike 모델에 userEmail컬럼으로 연결합니다.
      })

      // Users ExhibitionScrap 1:N
      this.hasMany(models.ExhibitionScrap, {
        sourceKey: 'userEmail',// 현재 모델의 userEmail 컬럼을
        foreignKey: 'userEmail'// ExhibitionScrap 모델에 userEmail컬럼으로 연결합니다.
      })
    }
  }
  Users.init({
    userEmail: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    userPassword: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'user_password'
    },
    loginType: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: "LT01",
      field: 'login_type'
    },
    accessToken: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'access_token'
    },
    userRole: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'UR01',
      field: 'user_role'
    },
    userStatus: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'US01',
      field: 'user_status'
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
    modelName: 'Users',
    tableName: 'users'
  });
  return Users;
};