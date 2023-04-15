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
//  */
router.post("/saveSelectedTitle", searchController.selectResult);

/**
 * 자동완성기능
 */
router.get("/auto", searchController.autocomplete);

/**
 * 최근검색기록
 */
router.get("/recentSearch", searchController.recentSearchHistory);

module.exports = router;
