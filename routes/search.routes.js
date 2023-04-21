const express = require("express");
const router = express.Router();
const publicAuthMiddleware = require("../middlewares/authMiddleware_public");

const SearchContorller = require("../controllers/search.controller");
const searchController = new SearchContorller();

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - search
 *     summary: "기본검색"
 *     parameters:
 *       - name: keyWord
 *         in: query
 *         type: string
 *         require: true
 *         description: "검색할 키워드를 입력해주세요"
 *     responses:
 *       "200":
 *         description: "받아온 쿼리를 바탕으로 검색을 합니다."
 *         schema:
 *          type: object
 *          properties:
 *            keyWord:
 *              type: string
 *     security:
 *       - jwt: []
 *   post:
 *     summary: 검색후 유저가 선택한 게시글저장
 *     tags: [search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "유저가 검색후 고른 title을 입력하는부분"
 *               type:
 *                 type: string
 *                 description: "type(아트그램, 전시회)을 입력해주는 부분"
 *             example:
 *               title: Example title
 *               type: exhibition
 *     responses:
 *       200:
 *         description: 검색기록이 저장되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 selectKeyword:
 *                   type: string
 *                   description: "유저가 검색후 고른 title을 입력하는부분"
 *                 message:
 *                   type: string
 *                   description: "type(아트그램, 전시회)을 입력해주는 부분"
 *     security:
 *        - jwt: []
 * /search/recent:
 *   get:
 *     tags:
 *      - search
 *     summary: "최근 검색기록 TOP 10"
 *     responses:
 *       200:
 *         description: 최근 검색기록을 조회
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recentHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       keyWord:
 *                         type: string
 *                         description: 최근 저장된 키워드를 조회합니다
 *                       type:
 *                         type: string
 *                         description: 최근 저장된 키워드의  type을 조회합니다
 *                       createdAt:
 *                         type: string
 *                         description: 최근 저장된 키워드의 시간을 조회합니다.
 *     security:
 *       - jwt: []
 * /search/rank:
 *   get:
 *     tags:
 *      - search
 *     summary: "인기검색어 TOP 10"
 *     responses:
 *       200:
 *         description: 가장많이 검색된 검색어조회
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 searchRank:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       keyWord:
 *                         type: string
 *                         description: 가장 많이 검색된 순으로 조회
 *                       count:
 *                         type: string
 *                         description: 조회된 count갯수
 *     security:
 *       - jwt: []
 * /search/category:
 *   get:
 *     tags:
 *       - search
 *     summary: "카테고리별 검색"
 *     parameters:
 *       - name : category
 *         in: query
 *         type: string
 *         required: true
 *         description: "검색할 카테고리입력 exhibition or artgram"
 *       - name: keyWord
 *         in: query
 *         type: string
 *         required: true
 *         description: "검색할 키워드입력"
 *     responses:
 *        "200":
 *           description: "검색완료"
 *           schema:
 *             type: object
 *             properties:
 *               categorySearch:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     keyWord:
 *                       type: string
 *                     type:
 *                       type: stirng
 *                     createdAt:
 *                       type: string
 *                   example:
 *                     keyWord: 테스트
 *                     type: artgram
 *     security:
 *       - jwt: []
 */

/**
 * 검색기능
 */
router.get("/", publicAuthMiddleware, searchController.search);

/**
 * 검색기록저장
 */
router.post("/", publicAuthMiddleware, searchController.selectResult);

/**
 * 유저의 최근검색기록 10개조회
 */
router.get(
  "/recent",
  publicAuthMiddleware,
  searchController.recentSearchHistory
);

/**
 * 메뉴별 검색 구분기능
 */
router.get("/category", publicAuthMiddleware, searchController.searchByType);

/**
 * 인기검색어 TOP10
 */
router.get("/rank", publicAuthMiddleware, searchController.searchByRank);

/**
 * 연관 검색어 기능(미구현)
 */
// router.get("/related", searchController.searchTerms);

module.exports = router;
