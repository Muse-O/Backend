const express = require("express");
const router = express.Router();

const SearchContorller = require("../controllers/search.controller");
const searchController = new SearchContorller();

router.get("/", searchController.search);

module.exports = router;
