const { Exhibitions, sequelize } = require("../models");

const {
  getKeyObjectFromRows,
} = require("../modules/sequelizeQueryTranslateUtils");

const dayjs = require("dayjs");
require("dayjs/locale/ko"); // 현재 지역에 해당하는 locale 로드 현재 국내 서비스이므로 한국 시간 설정

class BannerRepository {
  // 상단 배너 가져오기
  //

  /**
   * 현재 날짜에(한국 시간) 전시중인 전시회 중 좋아요 순 전시글
   * @param {integer} reqCnt 요청할 게시글 수
   *
   */
  getOpenExhibitionsSortedByMostLike = async (reqCnt) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const result = await sequelize.query(
      `
      SELECT
        e.exhibition_id AS exhibitionId,
        e.user_email AS userEmail,
        e.post_image AS postImage,
        e.exhibition_title AS exhibitionTitle,
        e.exhibition_desc AS exhibitionDesc,
        e.exhibition_kind AS exhibitionKind,
        e.exhibition_online_link AS exhibitionOnlineLink,
        e.start_date AS startDate,
        e.end_date AS endDate,
        e.location AS location,
        l.like_cnt AS likeCnt,
        a.zonecode,
        a.address,
        a.address_english AS addressEnglish,
        a.address_type AS addressType,
        a.building_name AS buildingName,
        a.building_code AS buildingCode,
        a.road_address AS roadAddress,
        a.road_address_english AS roadAddressEnglish,
        a.auto_jibun_address AS autoJibunAddress,
        a.auto_jibun_address_english AS autoJibunAddressEnglish,
        a.roadname ,
        a.roadname_code AS roadnameCode,
        a.roadname_english AS roadnameEnglish,
        up.profile_id AS authorProfileId,
        up.profile_nickname AS authorNickName,
        up.profile_img AS authorProfileImg,
        GROUP_CONCAT(ea.author_id) AS authorId,
        GROUP_CONCAT(ea.exhibition_id) AS exhibitionId,
        GROUP_CONCAT(ea.author_name) AS authorName
      FROM exhibitions e
      LEFT JOIN (
        SELECT
          exhibition_id,
          COUNT(exhibition_like_id) AS like_cnt
        FROM exhibition_like
        GROUP BY exhibition_id
      ) AS l ON e.exhibition_id = l.exhibition_id
      LEFT JOIN (
        SELECT 
          author_id,
          exhibition_id,
          author_name
        FROM exhibition_author
      ) AS ea ON e.exhibition_id = ea.exhibition_id
      LEFT JOIN (
        SELECT
          profile_id,
          user_email,
          profile_nickname,
          profile_img
        FROM user_profile
      ) AS up ON e.user_email = up.user_email
      LEFT JOIN exhibition_address AS a ON e.exhibition_id = a.exhibition_id
      WHERE '${formatted}' BETWEEN e.start_date AND e.end_date
      AND e.exhibition_status != 'ES04'
      GROUP BY e.exhibition_id
      ORDER BY l.like_cnt DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    const exhibitionList = {
      rows: result,
    };

    exhibitionList.rows.forEach((row) => {
      row.exhibitionAddress = getKeyObjectFromRows(
        row,
        'address',
        'zonecode',
        'address',
        'addressEnglish',
        'addressType',
        'buildingName',
        'buildingCode',
        'roadAddress',
        'roadAddressEnglish',
        'autoJibunAddress',
        'autoJibunAddressEnglish',
        'roadname' ,
        'roadnameCode',
        'roadnameEnglish'
      );
    });

    return exhibitionList;
  };

  /**
   * 현재 날짜에(한국 시간) 전시중인 전시회 중 작성일 최근순 전시글
   * @param {integer} reqCnt 요청할 게시글 수
   */
  getOpenExhibitionsSortedByDate = async (reqCnt) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const result = await sequelize.query(
      `
      SELECT
        e.exhibition_id AS exhibitionId,
        e.user_email AS userEmail,
        e.post_image AS postImage,
        e.exhibition_title AS exhibitionTitle,
        e.exhibition_desc AS exhibitionDesc,
        e.exhibition_kind AS exhibitionKind,
        e.exhibition_online_link AS exhibitionOnlineLink,
        e.start_date AS startDate,
        e.end_date AS endDate,
        e.location AS location,
        e.created_at AS createdAt,
        l.like_cnt AS likeCnt,
        a.zonecode,
        a.address,
        a.address_english AS addressEnglish,
        a.address_type AS addressType,
        a.building_name AS buildingName,
        a.building_code AS buildingCode,
        a.road_address AS roadAddress,
        a.road_address_english AS roadAddressEnglish,
        a.auto_jibun_address AS autoJibunAddress,
        a.auto_jibun_address_english AS autoJibunAddressEnglish,
        a.roadname ,
        a.roadname_code AS roadnameCode,
        a.roadname_english AS roadnameEnglish,
        up.profile_id AS authorProfileId,
        up.profile_nickname AS authorNickName,
        up.profile_img AS authorProfileImg
      FROM exhibitions e
      LEFT JOIN (
        SELECT
          exhibition_id,
          COUNT(exhibition_like_id) AS like_cnt
        FROM exhibition_like
        GROUP BY exhibition_id
      ) AS l ON e.exhibition_id = l.exhibition_id
      LEFT JOIN (
        SELECT
          profile_id,
          user_email,
          profile_nickname,
          profile_img
        FROM user_profile
      ) AS up ON e.user_email = up.user_email
      LEFT JOIN exhibition_address AS a ON e.exhibition_id = a.exhibition_id
      WHERE '${formatted}' BETWEEN e.start_date AND e.end_date
      AND e.exhibition_status != 'ES04'
      GROUP BY e.exhibition_id
      ORDER BY e.created_at DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    const exhibitionList = {
      rows: result,
    };

    return exhibitionList;
  };

  /**
   * 예정 전시회 중 가장 가까운 날짜 전시 중 좋아요 순
   * @param {integer} reqCnt 요청할 게시글 수
   */
  getFutureExhibitionsSortedByNearest = async (reqCnt) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const result = await sequelize.query(
      `SELECT
        e.exhibition_id AS exhibitionId,
        e.user_email AS userEmail,
        e.post_image AS postImage,
        e.exhibition_title AS exhibitionTitle,
        e.exhibition_desc AS exhibitionDesc,
        e.exhibition_kind AS exhibitionKind,
        e.exhibition_online_link AS exhibitionOnlineLink,
        e.start_date AS startDate,
        e.end_date AS endDate,
        e.location AS location,
        e.created_at AS createdAt,
        l.like_cnt AS likeCnt,
        a.zonecode,
        a.address,
        a.address_english AS addressEnglish,
        a.address_type AS addressType,
        a.building_name AS buildingName,
        a.building_code AS buildingCode,
        a.road_address AS roadAddress,
        a.road_address_english AS roadAddressEnglish,
        a.auto_jibun_address AS autoJibunAddress,
        a.auto_jibun_address_english AS autoJibunAddressEnglish,
        a.roadname ,
        a.roadname_code AS roadnameCode,
        a.roadname_english AS roadnameEnglish,
        up.profile_id AS authorProfileId,
        up.profile_nickname AS authorNickName,
        up.profile_img AS authorProfileImg,
        GROUP_CONCAT(ea.author_id) AS authorId,
        GROUP_CONCAT(ea.exhibition_id) AS exhibitionId,
        GROUP_CONCAT(ea.author_name) AS authorName
      FROM exhibitions e
      LEFT JOIN (
        SELECT
          exhibition_id,
          COUNT(exhibition_like_id) AS like_cnt
        FROM exhibition_like
        GROUP BY exhibition_id
      ) AS l ON e.exhibition_id = l.exhibition_id
      LEFT JOIN (
        SELECT 
          author_id,
          exhibition_id,
          author_name
        FROM exhibition_author
      ) AS ea ON e.exhibition_id = ea.exhibition_id
      LEFT JOIN (
        SELECT
          profile_id,
          user_email,
          profile_nickname,
          profile_img
        FROM user_profile
      ) AS up ON e.user_email = up.user_email
      LEFT JOIN exhibition_address AS a ON e.exhibition_id = a.exhibition_id
      WHERE '${formatted}' < e.start_date
      AND e.exhibition_status != 'ES04'
      GROUP BY e.exhibition_id
      ORDER BY e.created_at DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    const exhibitionList = {
      rows: result,
    };

    return exhibitionList;
  };

  /**
   * 최근 작성된 아트그램
   * @param {integer} reqCnt 요청할 게시글 수
   */
  getLatestArtgrams = async (reqCnt) => {
    const result = await sequelize.query(
      `
      SELECT 
        a.artgram_id AS artgramId,
        a.user_email AS userEmail,
        (
        SELECT 
          img_url 
        FROM artgram_img 
        WHERE artgram_id = a.artgram_id
        AND is_delete = 0
        ORDER BY img_order ASC 
        LIMIT 1
        ) AS imgUrl,
        up.profile_id AS authorProfileId,
        up.user_email AS authorEmail,
        up.profile_nickname AS authorNickName,
        up.profile_img AS authorProfileImg
      FROM artgrams a
      LEFT JOIN (
        SELECT
          artgram_id,
          COUNT(artgram_like_id) AS like_cnt
        FROM artgram_like
        GROUP BY artgram_id
      ) AS l ON a.artgram_id = l.artgram_id
      LEFT JOIN (
        SELECT
          profile_id,
          user_email,
          profile_nickname,
          profile_img
        FROM user_profile
      ) AS up ON a.user_email = up.user_email
      ORDER BY a.created_at DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    const artgramList = {
      rows: result,
    };

    return artgramList;
  };
}

module.exports = BannerRepository;
