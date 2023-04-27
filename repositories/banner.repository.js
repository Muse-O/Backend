const { ExhibitionAuthor, sequelize } = require("../models");

const {
  getKeyObjectFromRows,
} = require("../modules/sequelizeQueryTranslateUtils");

const dayjs = require("dayjs");
require("dayjs/locale/ko"); // 현재 지역에 해당하는 locale 로드 현재 국내 서비스이므로 한국 시간 설정

class BannerRepository {
  /**
   * 현재 날짜(한국 시간)기준 전시중/예정인 전시회 중 최근 작성 순 개인 전시글
   * @param {integer} reqCnt 요청할 게시글 수
   * @returns exhibitionList
   */
  getPersonalExhibitionsByRecent = async (reqCnt) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const result = await sequelize.query(
      `
      SELECT
        e.exhibition_id AS exhibitionId,
        e.exhibition_title AS exhibitionTitle,
        e.exhibition_desc AS exhibitionDesc,
        e.start_date AS startDate,
        e.end_date AS endDate,
        e.post_image AS postImage,
        CONCAT(SUBSTRING_INDEX(address,' ', 2),' ',e.location) AS location,
        get_code_name(e.exhibition_kind) AS exhibitionKind,
        l.like_cnt,
        GROUP_CONCAT(ea.authorName ORDER BY ea.author_order ASC) AS author,
        a.address
      FROM exhibitions e
      LEFT JOIN (
        SELECT
          exhibition_id,
          COUNT(exhibition_like_id) AS like_cnt
        FROM exhibition_like
        GROUP BY exhibition_id
      ) AS l ON e.exhibition_id = l.exhibition_id
      LEFT JOIN (
        SELECT exhibition_id, author_name AS authorName, author_order
        FROM exhibition_author
      ) AS ea ON e.exhibition_id = ea.exhibition_id
      LEFT JOIN exhibition_address AS a ON e.exhibition_id = a.exhibition_id
      WHERE '${formatted}' BETWEEN e.start_date AND e.end_date
      AND e.exhibition_status != 'ES04'
      AND e.exhibition_host = 'EH0001'
      GROUP BY e.exhibition_id
      ORDER BY l.like_cnt DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    ).catch(err => console.log(err));

    let cnt = 1;

    result.forEach((row) => {
      row.index = cnt++;
      row.sido = row.address ? row.address.split(' ')[0] : "";
      row.detailRouter = '/exhibition/detail/'+row.exhibitionId;
      row.author = row.author ? row.author.split(',') : [];
      
      delete row.like_cnt
      delete row.address
    })

    const exhibitionList = {
      rows: result,
    };

    return exhibitionList;
  };

  /**
   * 현재 날짜(한국 시간)기준 전시중인 전시회 중 좋아요 순 전시글
   * @param {integer} reqCnt 요청할 게시글 수
   * @returns exhibitionList
   */
  getOpenExhibitionsSortedByMostLike = async (reqCnt) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const result = await sequelize.query(
      `
      SELECT
        e.exhibition_id AS exhibitionId,
        e.exhibition_title AS exhibitionTitle,
        e.exhibition_eng_title AS exhibitionEngTitle,
        e.start_date AS startDate,
        e.end_date AS endDate,
        e.post_image AS postImage,
        CONCAT(SUBSTRING_INDEX(address,' ', 2),' ',e.location) AS location,
        get_code_name(e.exhibition_kind) AS exhibitionKind,
        l.like_cnt,
        a.address
      FROM exhibitions e
      LEFT JOIN (
        SELECT
          exhibition_id,
          COUNT(exhibition_like_id) AS like_cnt
        FROM exhibition_like
        GROUP BY exhibition_id
      ) AS l ON e.exhibition_id = l.exhibition_id
      LEFT JOIN exhibition_address AS a ON e.exhibition_id = a.exhibition_id
      WHERE '${formatted}' BETWEEN e.start_date AND e.end_date
      AND e.exhibition_status != 'ES04'
      GROUP BY e.exhibition_id
      ORDER BY l.like_cnt DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    let cnt = 1;

    result.forEach((row) => {
      row.index = cnt++;
      row.sido = row.address ? row.address.split(' ')[0] : "";
      row.detailRouter = '/exhibition/detail/'+row.exhibitionId;
      delete row.like_cnt
      delete row.address
    })


    const row1 = result.slice(0, 5);
    const row2 = result.slice(5, 10);

    const exhibitionList = {
      row1, row2
    };

    return exhibitionList;
  };

  /**
   * 현재 날짜에(한국 시간) 전시중인 전시회 중 작성일 최근순 전시글
   * @param {integer} reqCnt 요청할 게시글 수
   * @returns exhibitionList
   */
  getOpenExhibitionsSortedByDate = async (reqCnt) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const result = await sequelize.query(
      `
      SELECT
      e.exhibition_id AS exhibitionId,
      e.exhibition_title AS exhibitionTitle,
      e.start_date AS startDate,
      e.end_date AS endDate,
      e.post_image AS postImage,
      CONCAT(SUBSTRING_INDEX(address,' ', 2),' ',e.location) AS location,
      get_code_name(e.exhibition_kind) AS exhibitionKind,
      l.like_cnt,
      a.address
      FROM exhibitions e
      LEFT JOIN (
        SELECT
          exhibition_id,
          COUNT(exhibition_like_id) AS like_cnt
        FROM exhibition_like
        GROUP BY exhibition_id
      ) AS l ON e.exhibition_id = l.exhibition_id
      LEFT JOIN exhibition_address AS a ON e.exhibition_id = a.exhibition_id
      WHERE '${formatted}' BETWEEN e.start_date AND e.end_date
      AND e.exhibition_status != 'ES04'
      GROUP BY e.exhibition_id
      ORDER BY e.created_at DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    let cnt = 1;

    result.forEach((row) => {
      row.index = cnt++;
      row.sido = row.address ? row.address.split(' ')[0] : "";
      row.detailRouter = '/exhibition/detail/'+row.exhibitionId;
      delete row.like_cnt
      delete row.address
    })

    const exhibitionList = {
      rows: result,
    };

    return exhibitionList;
  };

  /**
   * 예정 전시회 중 가장 가까운 날짜 전시 중 좋아요 순
   * @param {integer} reqCnt 요청할 게시글 수
   * @returns exhibitionList
   */
  getFutureExhibitionsSortedByNearest = async (reqCnt) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const result = await sequelize.query(
      `SELECT
      e.exhibition_id AS exhibitionId,
      e.exhibition_title AS exhibitionTitle,
      e.exhibition_eng_title AS exhibitionEngTitle,
      e.start_date AS startDate,
      e.end_date AS endDate,
      e.post_image AS postImage,
      CONCAT(SUBSTRING_INDEX(address,' ', 2),' ',e.location) AS location,
      get_code_name(e.exhibition_kind) AS exhibitionKind,
      l.like_cnt,
      a.address
      FROM exhibitions e
      LEFT JOIN (
        SELECT
          exhibition_id,
          COUNT(exhibition_like_id) AS like_cnt
        FROM exhibition_like
        GROUP BY exhibition_id
      ) AS l ON e.exhibition_id = l.exhibition_id
      LEFT JOIN exhibition_address AS a ON e.exhibition_id = a.exhibition_id
      WHERE '${formatted}' < e.start_date
      AND e.exhibition_status != 'ES04'
      ORDER BY e.created_at DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    let cnt = 1;

    result.forEach((row) => {
      row.index = cnt++;
      row.sido = row.address ? row.address.split(' ')[0] : "";
      row.detailRouter = '/exhibition/detail/'+row.exhibitionId;
      delete row.like_cnt
      delete row.address
    })

    const exhibitionList = {
      rows: result,
    };

    return exhibitionList;
  };

  /**
   * 최근 작성된 아트그램
   * @param {integer} reqCnt 요청할 게시글 수
   * @returns artgramList
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
      WHERE a.artgram_status != 'AS04'
      ORDER BY a.created_at DESC
      LIMIT ${reqCnt};
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    
    let cnt = 1;

    result.forEach((row) => {
      row.index = cnt++;
    })

    const artgramList = {
      rows: result,
    };

    return artgramList;
  };
}

module.exports = BannerRepository;
