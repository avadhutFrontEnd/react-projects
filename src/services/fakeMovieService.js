import * as genresAPI from "./fakeGenreService";

// Movies from API - matching exact database entries
const movies = [
  {
    _id: "6777fb0eef2e9cc3d45406d5",
    title: "The Hangover+",
    genre: { _id: "6777fb0eef2e9cc3d45406da", name: "Action" },
    numberInStock: 28,
    dailyRentalRate: 6
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406d7",
    title: "Wedding Crashers",
    genre: { _id: "6777fb0eef2e9cc3d45406d1", name: "Comedy" },
    numberInStock: 15,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406dc",
    title: "Die Hard",
    genre: { _id: "6777fb0eef2e9cc3d45406da", name: "Action" },
    numberInStock: 5,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406de",
    title: "Terminator",
    genre: { _id: "6777fb0eef2e9cc3d45406da", name: "Action" },
    numberInStock: 9,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406e0",
    title: "The Avengers",
    genre: { _id: "6777fb0eef2e9cc3d45406da", name: "Action" },
    numberInStock: 15,
    dailyRentalRate: 2,
    image: "the-avenger.jpg" // Matches available image
  },
  {
    _id: "6777fb0eef2e9cc3d45406e5",
    title: "The Notebook",
    genre: { _id: "6777fb0eef2e9cc3d45406e3", name: "Romance" },
    numberInStock: 5,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406e7",
    title: "When Harry Met Sally",
    genre: { _id: "6777fb0eef2e9cc3d45406e3", name: "Romance" },
    numberInStock: 10,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406e9",
    title: "Pretty Woman",
    genre: { _id: "6777fb0eef2e9cc3d45406e3", name: "Romance" },
    numberInStock: 15,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406ee",
    title: "The Sixth Sense",
    genre: { _id: "6777fb0eef2e9cc3d45406ec", name: "Thriller" },
    numberInStock: 5,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406f0",
    title: "Gone Girl",
    genre: { _id: "6777fb0eef2e9cc3d45406ec", name: "Thriller" },
    numberInStock: 10,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "6777fb0eef2e9cc3d45406f2",
    title: "The Others",
    genre: { _id: "6777fb0eef2e9cc3d45406ec", name: "Thriller" },
    numberInStock: 15,
    dailyRentalRate: 2
    // No matching image - will use placeholder
  },
  {
    _id: "677a9a7ed55f0f5920b70321",
    title: "Avadhut's Movie",
    genre: { _id: "6777fb0eef2e9cc3d45406da", name: "Action" },
    numberInStock: 55,
    dailyRentalRate: 10
    // No matching image - will use placeholder
  },
  {
    _id: "677aaa0ed55f0f5920b70454",
    title: "Last Movie 8 Chapter",
    genre: { _id: "6777fb0eef2e9cc3d45406e3", name: "Romance" },
    numberInStock: 34,
    dailyRentalRate: 6
    // No matching image - will use placeholder
  }
];

export function getMovies() {
  return movies;
}

export function getMovie(id) {
  return movies.find(m => m._id === id);
}

export function saveMovie(movie) {
  let movieInDb = movies.find(m => m._id === movie._id) || {};
  movieInDb.title = movie.title;
  movieInDb.genre = genresAPI.genres.find(g => g._id === movie.genreId);
  movieInDb.numberInStock = movie.numberInStock;
  movieInDb.dailyRentalRate = movie.dailyRentalRate;

  if (!movieInDb._id) {
    movieInDb._id = Date.now().toString();
    movies.push(movieInDb);
  }

  return movieInDb;
}

export function deleteMovie(id) {
  let movieInDb = movies.find(m => m._id === id);
  movies.splice(movies.indexOf(movieInDb), 1);
  return movieInDb;
}
