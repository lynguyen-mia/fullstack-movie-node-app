const express = require("express");
const router = express.Router();

const searchController = require("../controllers/searchCtrl");

router.post("/api/movies/search", searchController.findMovieByKw);

module.exports = router;
