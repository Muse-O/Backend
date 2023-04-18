const express = require("express");
const router = express.Router();

const SearchContorller = require("../controllers/search.controller");
const searchController = new SearchContorller();

/**
 * 검색기능
 */
router.get("/", searchController.search);

/**
 * 검색기록저장
 */
router.post("/save", searchController.selectResult);

/**
 * 자동완성기능
 */
router.get("/auto", searchController.autocomplete);

/**
 * 최근검색기록
 */
router.get("/recent", searchController.recentSearchHistory);

/**
 * 메뉴별 검색 구분기능
 */
router.get("/category", searchController.searchByType);

/**
 * 연관 검색어 기능
 */
// router.get("/related", searchController.searchTerms);

module.exports = router;
