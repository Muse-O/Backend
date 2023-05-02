const {
  Exhibitions,
  ExhibitionImg,
  ExhibitionCategory,
  ExhibitionAuthor,
  ExhibitionAddress,
  ExhibitionLike,
  ExhibitionScrap,
  ExhibitionReviews,
  ExhibitionHashtag,
  UserProfile,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

const { isNotNull } = require("../modules/isNotNull.js");

const dayjs = require("dayjs");
const { subtract } = require("lodash");
require("dayjs/locale/ko"); // 현재 지역에 해당하는 locale 로드 현재 국내 서비스이므로 한국 시간 설정

class ExhibitionRepository {
  /**
   * 전시 게시글 목록 조회
   * @param {number} limit 요청할 전시 게시글 수
   * @param {number} offset 조회 전시 게시글 시작점
   * @param {string} userEmail 유저 이메일
   * @param {object} filter 검색 필터링
   * @returns exhibitionItem
   */
  getExhibitionList = async (limit, offset, userEmail, filter) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const { startDate, endDate, category, tag, where, searchTitle } = filter;

    console.log('\n\n filter => ',startDate, endDate, category, tag, where, searchTitle)

    const result = await sequelize.query(
      `
      SELECT
      e.exhibition_id AS exhibitionId,
      e.user_email AS userEmail,
      e.exhibition_title AS exhibitionTitle,
      e.exhibition_eng_title AS exhibitionEngTitle,
      e.exhibition_desc AS exhibitionDesc,
      e.start_date AS startDate,
      e.end_date AS endDate,
      e.entrance_fee AS entranceFee,
      e.post_image AS postImage,
      e.art_work_cnt AS artWorkCnt,
      e.location,
      SUBSTRING_INDEX(a.address,' ', 2) AS sigungu,
      a.address,
      e.contact,
      e.exhibition_host AS exhibitionHost,
      get_code_name(e.exhibition_host) AS exhibitionHostName,
      e.exhibition_kind AS exhibitionKind,
      get_code_name(e.exhibition_kind) AS exhibitionKindName,
      e.exhibition_link AS exhibitionLink,
      e.exhibition_online_link AS exhibitionOnlineLink,
      e.location,
      e.agency_and_sponsor AS agencyAndSponsor,
      e.exhibition_status AS exhibitionStatus,
      get_code_name(e.exhibition_status) AS exhibitionStatusName,
      e.open_time AS openTime,
      e.close_time AS closeTime,
      e.significant AS significant,
      e.created_at AS createdAt,
      (CASE
          WHEN e.start_date > '${formatted}' THEN '전시 예정'
          WHEN e.end_date < '${formatted}' THEN '전시 종료'
          ELSE '전시 진행'
      END) AS exhibitionStatus,
      COALESCE(r.reviewAvgRating, 0) AS reviewAvgRating,
      COALESCE(r.reviewCnt, 0) AS reviewCnt,
      (CASE 
          WHEN l.user_email = '${userEmail}' THEN 1
          ELSE 0
      END) liked,
      (CASE 
          WHEN s.user_email = '${userEmail}' THEN 1
          ELSE 0
      END) scraped,
      COALESCE(l.likeCnt, 0) AS likeCnt,
      COALESCE(s.scrapCnt, 0) AS scrapCnt,
      GROUP_CONCAT(DISTINCT h.tag_name ORDER BY h.tagRank DESC) AS tagName,
      GROUP_CONCAT(DISTINCT ec.exhibition_code ORDER BY ec.created_at DESC) AS categoryCode,
      GROUP_CONCAT(DISTINCT get_code_name(ec.exhibition_code) ORDER BY ec.created_at DESC) AS categoryCodeName,
      p.profile_id AS authorProfileId,
      p.profile_nickname AS authorNickName,
      p.profile_img AS authorProfileImg,
      p.profile_intro AS authorProfileIntro,
      GROUP_CONCAT(ea.authorName ORDER BY ea.author_order ASC) AS author
      FROM exhibitions e
      LEFT JOIN (
        SELECT
            exhibition_id,
            user_email,
            COUNT(exhibition_like_id) AS likeCnt
        FROM exhibition_like
        GROUP BY exhibition_id
      ) AS l ON e.exhibition_id = l.exhibition_id
      LEFT JOIN (
        SELECT
            exhibition_id,
            user_email,
            COUNT(exhibition_scrap_id) AS scrapCnt
        FROM exhibition_scrap
        GROUP BY exhibition_id
      ) AS s ON e.exhibition_id = s.exhibition_id
      LEFT JOIN (
        SELECT
            exhibition_id,
            ROUND(AVG(review_rating),2) AS reviewAvgRating,
            COUNT(exhibition_review_id) AS reviewCnt
        FROM exhibition_review
        GROUP BY exhibition_id
      ) AS r ON e.exhibition_id = r.exhibition_id
      LEFT JOIN (
        SELECT exhibition_id, tag_name, COUNT(exhibition_tag_id) AS tagRank
        FROM exhibition_hashtag
        WHERE is_use = 'Y'
        GROUP BY exhibition_id, tag_name
      ) AS h ON e.exhibition_id = h.exhibition_id
      LEFT JOIN (
        SELECT exhibition_id, author_name AS authorName, author_order
        FROM exhibition_author
      ) AS ea ON e.exhibition_id = ea.exhibition_id
      LEFT JOIN exhibition_category ec ON e.exhibition_id = ec.exhibition_id
      LEFT JOIN (
        SELECT
            user_email,
            profile_id,
            profile_nickname,
            profile_img,
            profile_intro
        FROM user_profile
      ) AS p ON e.user_email = p.user_email 
      LEFT JOIN exhibition_address a ON e.exhibition_id = a.exhibition_id
      WHERE e.exhibition_status != 'ES04'
      ${startDate ? `AND e.start_date >= '${startDate}'` : ""} ${endDate ? `AND e.end_date <= '${endDate}'` : ""}
      ${category ? `AND ec.exhibition_code IN ('${category}')` : ""}
      ${tag ? `AND h.tag_name IN ('${tag}')` : ""}
      ${where ? `AND a.address LIKE '%${where}%'` : ""}
      ${searchTitle ? `AND e.exhibition_title LIKE '%${searchTitle}%'` : ""}
      GROUP BY e.exhibition_id
      ORDER BY e.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset};
      `,
      { type: sequelize.QueryTypes.SELECT }
    ).catch(err => {
      console.log(err);
    });

    result.forEach((row, idx) => {
      const { tagName, categoryCode, categoryCodeName, author } = row;

      const tagNames = tagName ? tagName.split(",") : [];
      const categoryCodes = categoryCode ? categoryCode.split(",") : [];
      const categoryCodeNames = categoryCodeName
        ? categoryCodeName.split(",")
        : [];
      const authors = author ? author.split(",") : "";

      const len = authors.length;
      let authorOutput = "";
      
      if (len === 1) {
        authorOutput = authors[0];
      } else if (len === 2) {
        authorOutput = `${authors[0]} 외 $1명`;
      } else if (len > 2) {
        authorOutput = `${authors[0]} 외 ${len - 1}명`;
      }

      result[idx].tagName = tagNames;
      result[idx].categoryCode = categoryCodes;
      result[idx].categoryCodeName = categoryCodeNames;
      result[idx].authorNickName = authorOutput;
      delete row.author;
    });

    const exhibitionList = {
      rows: result,
    };

    const exhibitionCnt = await Exhibitions.count({
      where: { exhibition_status: { [Op.ne]: ["ES04"] } },
    });

    const hasNextPage = offset + limit < exhibitionCnt;

    const paginationInfo = {
      limit,
      offset,
      exhibitionCnt,
      hasNextPage,
    };

    return { exhibitionList, paginationInfo };
  };

  /**
   * 전시 상세 조회
   * @param {string} exhibitionId
   * @param {string} userEmail 유저 이메일
   * @returns exhibitionInfo
   */
  getExhibitionInfo = async (exhibitionId, userEmail) => {
    const now = dayjs(); // 현재 지역별 시간 데이터를 가져옴
    const formatted = now.locale("ko").format("YYYY-MM-DD HH:mm:ss");

    const exhibitionItem = await Exhibitions.findOne({
      include: [
        {
          model: ExhibitionImg,
          attributes: [
            [sequelize.literal("img_order"), "order"],
            "imgUrl",
            "imgCaption",
          ],
          order: [["img_order", "ASC"]],
        },
        {
          model: ExhibitionAuthor,
          attributes: [
            [sequelize.literal("author_order"), "order"],
            [sequelize.literal("author_name"), "author"],
          ],
          order: [["author_id", "ASC"]],
        },
        {
          model: ExhibitionCategory,
          attributes: [
            "categoryCode",
            [
              sequelize.literal("get_code_name(exhibition_code)"),
              "categoryName",
            ],
          ],
        },
        {
          model: ExhibitionAddress,
          attributes: [
            "zonecode",
            "address",
            "addressEnglish",
            "addressType",
            "buildingName",
            "buildingCode",
            "roadAddress",
            "roadAddressEnglish",
            "autoJibunAddress",
            "autoJibunAddressEnglish",
            "roadname",
            "roadnameCode",
            "roadnameEnglish",
          ],
        },
      ],
      attributes: [
        "exhibitionId",
        "userEmail",
        "exhibitionTitle",
        "exhibitionEngTitle",
        "exhibitionDesc",
        "exhibitionKind",
        [
          sequelize.literal("get_code_name(Exhibitions.exhibition_kind)"),
          "exhibitionKindName",
        ],
        "exhibitionHost",
        [
          sequelize.literal("get_code_name(Exhibitions.exhibition_host)"),
          "exhibitionHostName",
        ],
        "exhibitionLink",
        "exhibitionOnlineLink",
        "startDate",
        "endDate",
        "openTime",
        "closeTime",
        "significant",
        "entranceFee",
        "postImage",
        "artWorkCnt",
        "contact",
        "agencyAndSponsor",
        "location",
        "exhibitionStatus",
        "createdAt",
      ],
      where: { exhibitionId, exhibition_status: { [Op.ne]: ["ES04"] } },
    }).catch((err) => console.log(err));

    const userProfile = await UserProfile.findOne({
      where: { userEmail: exhibitionItem.userEmail },
    });

    const likeCnt = await ExhibitionLike.count({
      where: { exhibitionId },
    });

    const scrapCnt = await ExhibitionScrap.count({
      where: { exhibitionId },
    });

    const reviewStatus = await ExhibitionReviews.findAll({
      attributes: [
        [
          sequelize.fn("COUNT", sequelize.col("exhibition_review_id")),
          "reviewCnt",
        ],
        [
          sequelize.fn(
            "ROUND",
            sequelize.fn("AVG", sequelize.col("review_rating")),
            2
          ),
          "reviewAvgRating",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.where(sequelize.col("review_rating"), 1)
          ),
          "ratingOneCnt",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.where(sequelize.col("review_rating"), 2)
          ),
          "ratingTwoCnt",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.where(sequelize.col("review_rating"), 3)
          ),
          "ratingThreeCnt",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.where(sequelize.col("review_rating"), 4)
          ),
          "ratingFourCnt",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.where(sequelize.col("review_rating"), 5)
          ),
          "ratingFiveCnt",
        ],
      ],
      where: { exhibitionId },
    });

    const liked = await ExhibitionLike.findOne({
      where: { exhibitionId, user_email: userEmail },
    });

    const scraped = await ExhibitionScrap.findOne({
      where: { exhibitionId, user_email: userEmail },
    });

    const exhibitionInfo = exhibitionItem.toJSON();

    exhibitionInfo.likeCnt = likeCnt;
    exhibitionInfo.scrapCnt = scrapCnt;
    exhibitionInfo.reviewStatus = reviewStatus;
    exhibitionInfo.liked = liked instanceof ExhibitionLike ? 1 : 0;
    exhibitionInfo.scraped = scraped instanceof ExhibitionScrap ? 1 : 0;

    const startDate = new Date(exhibitionInfo.startDate);
    const endDate = new Date(exhibitionInfo.endDate);
    const targetDate = new Date(formatted);

    exhibitionInfo.exhibitionStatus =
      startDate.getTime() > targetDate.getTime()
        ? "전시 예정"
        : endDate.getTime() < targetDate.getTime()
        ? "전시 종료"
        : "전시 진행";

    if (userProfile) {
      exhibitionInfo.authorProfile = userProfile.toJSON();
    } else {
      exhibitionInfo.authorProfile = {};
    }

    return exhibitionInfo;
  };

  /**
   * 전시회 정보 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} userEmail 유저 이메일
   * @param {object} exhibitionObj 전시회 정보 객체
   * @returns 입력한 전시 정보
   */
  updateExhibition = async (mode, userEmail, exhibitionObj) => {
    let updateExhibition = {};

    if (mode === "C") {
      // 작성
      const { exhibitionId, ...exhibitionInfo } = exhibitionObj;
      updateExhibition = await Exhibitions.create({
        userEmail,
        ...exhibitionInfo,
      });
    } else if (mode === "U") {
      // 수정

      updateExhibition = await Exhibitions.update(
        {
          userEmail,
          ...exhibitionObj,
        },
        {
          where: {
            [Op.and]: [
              { exhibitionId: exhibitionObj.exhibitionId },
              { userEmail },
            ],
          },
        }
      );

      updateExhibition.exhibitionId = exhibitionObj.exhibitionId;
    }

    return updateExhibition;
  };

  /**
   * 전시회 이미지 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {array[object]} delImage 삭제할 이미지
   * @param {array[object]} artImage 추가할 이미지
   * @returns deleteImgCnt: number, updateImgCnt: number 이미지 수정 정보
   */
  updateExhibitionImg = async (mode, exhibitionId, delImage, artImage) => {
    let updateImgStatus = { deleteImgCnt: 0, updateImgCnt: 0 };
    let updateExhibitionArtImg = null;

    // order가 작은순대로 정렬
    artImage.sort((a, b) => parseInt(a.order) - parseInt(b.order));

    const rowToArtImg = artImage.map(({ order, imgUrl, imgCaption }) => ({
      exhibitionId,
      imgOrder: order,
      imgUrl,
      imgCaption,
    }));

    if (mode === "C") {
      // 이미지 추가
      updateExhibitionArtImg = await ExhibitionImg.bulkCreate(rowToArtImg);

      updateImgStatus.updateImgCnt = updateExhibitionArtImg.length;
    } else if (mode === "U") {
      // 기존 이미지 삭제
      const deleteCnt = await ExhibitionImg.destroy({
        where: { exhibitionId },
      });
      updateImgStatus.deleteImgCnt = deleteCnt;
      // 이미지 추가
      updateExhibitionArtImg = await ExhibitionImg.bulkCreate(rowToArtImg);
      updateImgStatus.updateImgCnt = updateExhibitionArtImg.length;
    } else {
      updateImgStatus.updateImgCnt = 0;
    }
    return updateImgStatus;
  };

  /**
   * 전시회 카테고리 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {array[string]} categories 추가할 카테고리
   * @returns deleteCategoriesCnt: number, updateCategoriesCnt: number 카테고리 수정 정보
   */
  updateExhibitionCategory = async (mode, exhibitionId, category) => {
    let updateCategoryStatus = {
      deleteCategoriesCnt: 0,
      updateCategoriesCnt: 0,
    };
    let updateExhibitionCategories = null;

    const rowToCategory = {
      exhibitionId,
      categoryCode: category,
    };

    if (mode === "C") {
      // 카테고리 추가
      updateExhibitionCategories = await ExhibitionCategory.create(
        rowToCategory
      );

      updateCategoryStatus.updateCategoriesCnt =
        updateExhibitionCategories.length;
    } else if (mode === "U") {
      // 기존 카테고리 삭제
      const deleteCategoriesCnt = await ExhibitionCategory.destroy({
        where: { exhibitionId },
      });
      updateCategoryStatus.deleteCategoriesCnt = deleteCategoriesCnt;
      // 카테고리 추가
      updateExhibitionCategories = await ExhibitionCategory.create(
        rowToCategory
      );

      updateCategoryStatus.updateCategoriesCnt =
        updateExhibitionCategories.length;
    } else {
      updateCategoryStatus.updateCategoriesCnt = 0;
    }
    return updateCategoryStatus;
  };

  /**
   * 전시회 작가 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {array[object]} authors 작가 정보
   * @returns deleteAuthorCnt: number, updateAuthorCnt: number 작사 수정 정보
   */
  updateExhibitionAuthors = async (mode, exhibitionId, authors) => {
    let updateAuthorStatus = { deleteAuthorCnt: 0, updateAuthorCnt: 0 };
    let updateExhibitionAuthor = null;

    // order가 작은순대로 정렬
    authors.sort((a, b) => parseInt(a.order) - parseInt(b.order));

    const rowToAuthor = authors.map(({ order, author }) => ({
      exhibitionId,
      authorOrder: order,
      authorName: author,
    }));

    if (mode === "C") {
      // 전시회 추가
      updateExhibitionAuthor = await ExhibitionAuthor.bulkCreate(rowToAuthor);

      updateAuthorStatus.updateAuthorCnt = updateExhibitionAuthor.length;
    } else if (mode === "U") {
      // 기존 카테고리 삭제
      const deleteAuthorCnt = await ExhibitionAuthor.destroy({
        where: { exhibitionId },
      });
      updateAuthorStatus.deleteAuthorCnt = deleteAuthorCnt;
      // 전시회 추가
      updateExhibitionAuthor = await ExhibitionAuthor.bulkCreate(rowToAuthor);

      updateAuthorStatus.updateAuthorCnt = updateExhibitionAuthor.length;
    } else {
      updateAuthorStatus.updateAuthorCnt = 0;
    }
    return updateAuthorStatus;
  };

  /**
   * 전시회 장소 입력
   * @param {string} mode 작성/수정 모드
   * @param {string} exhibitionId 전시 게시글 ID
   * @param {object} detailLocation 전시회 장소 정보
   * @returns deleteLocationCnt: number, updateLocationCnt: number 장소 수정 정보
   */
  updateExhibitionLocation = async (mode, exhibitionId, detailLocation) => {
    let updateLocationStatus = { deleteLocationCnt: 0, updateLocationCnt: 0 };
    let updateExhibitionLocation = null;

    if (mode === "C") {
      // 장소 추가
      updateExhibitionLocation = await ExhibitionAddress.create({
        exhibitionId,
        ...detailLocation,
      });

      if (updateExhibitionLocation) {
        updateLocationStatus.updateLocationCnt = 1;
      }
    } else if (mode === "U") {
      // 기존 장소 삭제
      const deleteLocationCnt = await ExhibitionAddress.destroy({
        where: { exhibitionId },
      });
      updateLocationStatus.deleteLocationCnt = deleteLocationCnt;
      // 장소 추가
      updateExhibitionLocation = await ExhibitionAddress.create({
        exhibitionId,
        ...detailLocation,
      });

      if (updateExhibitionLocation) {
        updateLocationStatus.updateLocationCnt = 1;
      }
    } else {
      updateLocationStatus.updateLocationCnt = 0;
    }
    return updateLocationStatus;
  };

  /**
   * 전시 게시글 삭제
   * @param {string} userEmail
   * @param {string} exhibitionId
   * @returns 삭제 게시글 갯수
   */
  deleteExhibition = async (userEmail, exhibitionId) => {
    const removeExhibitionCnt = await Exhibitions.update(
      {
        exhibitionStatus: "ES04",
      },
      {
        where: {
          [Op.and]: [{ userEmail }, { exhibitionId }],
        },
      }
    );

    return removeExhibitionCnt;
  };

  /**
   * 전시 게시글 스크랩
   * @param {string} userEmail
   * @param {string} exhibitionId
   * @returns 스크랩 등록(create) or 취소(delete)
   */
  updateExhibitionScrap = async (userEmail, exhibitionId) => {
    const scrapExhibition = await ExhibitionScrap.findOrCreate({
      where: {
        [Op.and]: [{ exhibitionId }, { userEmail }],
      },
      defaults: {
        exhibitionId,
        userEmail,
      },
    }).then(([data, created]) => {
      if (!created) {
        data.destroy();
        return "delete";
      }
      return "create";
    });

    return scrapExhibition;
  };

  /**
   * 전시 게시글 좋아요
   * @param {string} userEmail
   * @param {string} exhibitionId
   * @returns 스크랩 좋아요(create) or 취소(delete)
   */
  updateExhibitionLike = async (userEmail, exhibitionId) => {
    const likeExhibition = await ExhibitionLike.findOrCreate({
      where: {
        [Op.and]: [{ exhibitionId }, { userEmail }],
      },
      defaults: {
        exhibitionId,
        userEmail,
      },
    }).then(([data, created]) => {
      if (!created) {
        data.destroy();
        return "delete";
      }
      return "create";
    });
    return likeExhibition;
  };

  /**
   * 전시 게시글 카테고리별 검색
   * @param {array[string]} categories
   * @returns 검색된 게시글 리스트
   */
  searchCategoryExhibition = async (categories) => {
    const exhibitionList = await Exhibitions.findAll({
      include: [
        {
          model: ExhibitionCategory,
          where: { categoryCode: { [Op.and]: [categories] } },
          attributes: [],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return exhibitionList;
  };

  /**
   * 3개월간 가장 많은 태그 TOP 10
   * @returns tagTags TOP 10 태그
   */
  getTopTags = async () => {
    
    const tagTags = await ExhibitionHashtag.findAll({
      attributes: ['tagName', [sequelize.fn('COUNT', sequelize.col('tag_name')),'tagCount']],
      where: {
        createdAt: {
          [Op.gt]: dayjs().subtract(3, 'month').toDate(),
          [Op.lte]: dayjs().toDate()
        }
      },
      group: ['tagName'],
      order: [[sequelize.literal('tagCount'), 'DESC']],
      limit:10,
      raw: true
    }).catch(err => console.log(err));

    return tagTags;
  };
}

module.exports = ExhibitionRepository;
