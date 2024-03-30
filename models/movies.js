const fs = require("fs");
const path = require("path");

function getPath(fileName) {
  return path.join(path.dirname(require.main.filename), "data", fileName);
}

module.exports = class Movie {
  static async getMovies() {
    const data = await fs.promises.readFile(getPath("movieList.json"), "utf8");
    return JSON.parse(data);
  }

  static async getGenres() {
    const data = await fs.promises.readFile(getPath("genreList.json"), "utf8");
    return JSON.parse(data);
  }

  static async getTrailers(id) {
    // Read videoList file
    const data = await fs.promises.readFile(getPath("videoList.json"), "utf8");
    const videoList = JSON.parse(data);

    // Get video array of the specific id
    const videos = videoList.find((movie) => movie.id === id)?.videos;
    return videos;
  }
};
