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
 * 전시회
 * 아트그램
//  */
// router.post("/saveSelectedExhibition", searchController.selectExhibition);
// router.post("/saveSelectedArtgram", searchController.selectArtgram);

/**
 * 자동완성기능
 */
router.get("/auto", searchController.autocomplete);

module.exports = router;
