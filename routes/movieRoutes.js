const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movieCtrl");

router.get("/api/movies/trending", movieController.getTrendingMovies);

router.get("/api/movies/top-rate", movieController.getTopRatedMovies);

router.get("/api/movies/discover", movieController.getMoviesByGenre);

router.post("/api/movies/video", movieController.postFetchMovieTrailer);

module.exports = router;
