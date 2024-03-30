const movieModel = require("../models/movies");
const pagingFn = require("../utils/paging");

exports.findMovieByKw = async (req, res, next) => {
  const keyword = req.body.keyword?.toLowerCase();
  if (!keyword) {
    return res.status(400).json({ message: "Not found keyword param" });
  }
  // Get all query params
  const curPage = req.query.page || 1;
  const genreId = Number(req.query.genre);
  const type = req.query.type;
  const lang = req.query.lang;
  const year = req.query.year;

  // Get all movies
  const movies = await movieModel.getMovies();

  // FILTERTING PROCESS: one after another
  // Filter by search keyword
  const keywordResults = movies.filter((movie) => {
    const title = movie.title?.toLowerCase();
    const overview = movie.overview?.toLowerCase();
    return title?.includes(keyword) || overview?.includes(keyword);
  });

  let filteredResults = [...keywordResults];

  // Filter by genre
  if (genreId && genreId !== "All") {
    filteredResults = filteredResults?.filter((movie) =>
      movie["genre_ids"].find((id) => Number(id) === genreId)
    );
  }

  // Filter by type
  if (type && type !== "All") {
    filteredResults = filteredResults?.filter(
      (movie) => movie["media_type"] === type
    );
  }

  // Filter by language
  if (lang && lang !== "All") {
    filteredResults = filteredResults?.filter(
      (movie) => movie["original_language"] === lang
    );
  }

  // Filter by year
  if (year && year !== "All") {
    filteredResults = filteredResults?.filter((movie) => {
      const movieYear =
        movie["release_date"]?.split("-")[0] ||
        movie["first_air_date"]?.split("-")[0];
      return movieYear === year;
    });
  }
  // console.log(filteredResults);

  // Get movies based on current page
  const totalPage = Math.ceil(filteredResults.length / 20);
  const searchedMovies = pagingFn(filteredResults, curPage);
  // console.log(searchedMovies);

  res
    .status(200)
    .json({ results: searchedMovies, page: curPage, total_pages: totalPage });
};
