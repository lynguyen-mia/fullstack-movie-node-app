const movieModel = require("../models/movies");
const pagingFn = require("../utils/paging");

exports.getTrendingMovies = async (req, res, next) => {
  const curPage = req.query.page || 1;
  const allTrendingMovies = await movieModel.getMovies();
  allTrendingMovies.sort(
    (a, b) => parseFloat(b.popularity) - parseFloat(a.popularity)
  );
  const totalPage = Math.ceil(allTrendingMovies.length / 20);
  // Get movies based on page
  const trendingMovies = pagingFn(allTrendingMovies, curPage);

  res
    .status(200)
    .json({ results: trendingMovies, page: curPage, total_pages: totalPage });
};

exports.getTopRatedMovies = async (req, res, next) => {
  const curPage = req.query.page || 1;
  const allTopRatedMovies = await movieModel.getMovies();
  allTopRatedMovies.sort(
    (a, b) => parseFloat(b["vote_average"]) - parseFloat(a["vote_average"])
  );
  const totalPage = Math.ceil(allTopRatedMovies.length / 20);
  // Get movies based on page
  const topRatedMovies = pagingFn(allTopRatedMovies, curPage);

  res
    .status(200)
    .json({ results: topRatedMovies, page: curPage, total_pages: totalPage });
};

exports.getMoviesByGenre = async (req, res, next) => {
  // get available genres
  const genresList = await movieModel.getGenres();
  // get params from request
  const curPage = req.query.page || 1;
  const genreId = Number(req.query.genre);
  // if there's no genre
  if (!genreId) {
    return res
      .status(400)
      .json({ data: {}, message: "Not found genre parram" });
  }
  // if genre Id param is not in the list
  const isGenreValid = genresList.some((g) => g.id === genreId);
  if (!isGenreValid) {
    return res
      .status(404)
      .json({ data: {}, message: "Not found that genre id" });
  }

  // find movies that have the required genre id
  const movies = await movieModel.getMovies();
  const allGenreMovies = movies.filter((movie) =>
    movie["genre_ids"].find((id) => Number(id) === genreId)
  );
  const totalPage = Math.ceil(allGenreMovies.length / 20);
  const genreName = genresList.find((g) => g.id === genreId).name;

  // Get movies based on page
  const genreMovies = pagingFn(allGenreMovies, curPage);

  res.status(200).json({
    results: genreMovies,
    page: curPage,
    total_pages: totalPage,
    genre_name: genreName
  });
};

exports.postFetchMovieTrailer = async (req, res, next) => {
  const movieId = req.body.id;
  if (!movieId) {
    return res
      .status(400)
      .json({ data: {}, message: "Not found film_id param" });
  }
  19;
  // Get movie's video array
  const videos = await movieModel.getTrailers(movieId);
  if (videos) {
    // Filter qualified videos
    const qualifiedVideos = videos.filter(
      (video) =>
        video.official === true &&
        video.site === "YouTube" &&
        (video.type === "Teaser" || video.type === "Trailer")
    );
    qualifiedVideos.sort(
      (a, b) =>
        b.type.localeCompare(a.type) ||
        Date.parse(b["published_at"]) - Date.parse(a["published_at"])
    );
    if (qualifiedVideos.length === 0) {
      return res.status(404).json({ data: {}, message: "Not found video" });
    }
    // console.log(qualifiedVideos);
    res.status(200).send(qualifiedVideos);
  } else {
    res.json({});
  }
};
