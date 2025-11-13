import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/movieService";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import SearchBox from "./common/searchBox";
import LoadingSpinner from "./common/loadingSpinner";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import HeroSection from "./heroSection";
import Like from "./common/like";
import auth from "../services/authService";
import { getMovieImage, getPlaceholderImage } from "../utils/imageHelper";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 12,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
    activeFilter: "Latest",
    loading: true,
  };

  async componentDidMount() {
    try {
      const [genresResponse, moviesResponse] = await Promise.all([
        getGenres(),
        getMovies(),
      ]);
      
      const genres = [{ _id: "", name: "All Genres" }, ...genresResponse.data];
      const movies = moviesResponse.data;
      
      this.setState({ movies, genres, loading: false });
    } catch (ex) {
      this.setState({ loading: false });
      toast.error("Error loading movies");
    }
  }

  handleDelete = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
      toast.success("Movie deleted successfully");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");

      this.setState({ movies: originalMovies });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleFilterChange = (filter) => {
    this.setState({ activeFilter: filter, currentPage: 1 });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      movies: allMovies,
    } = this.state;

    let filtered = allMovies;

    if (searchQuery) {
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedGenre && selectedGenre._id) {
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  renderMovieCard = (movie) => {
    const user = auth.getCurrentUser();
    const isAdmin = user && user.isAdmin;

    // Get movie image using helper function
    const movieImage = getMovieImage(movie) || getPlaceholderImage(movie.title, 300, 400);

    return (
      <div key={movie._id} className="movie-card">
        <div className="movie-card-image-wrapper">
          <div
            className="movie-card-image"
            style={{
              backgroundImage: `url(${movieImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="episode-badge">
            {movie.numberInStock > 0 ? `In Stock` : "Out of Stock"}
          </div>
        </div>
        <div className="movie-card-content">
          <h3 className="movie-card-title">
            <Link
              to={`/movies/${movie._id}`}
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              {movie.title}
            </Link>
          </h3>
          <p className="movie-card-description">
            {movie.genre?.name || "Action"} • {movie.dailyRentalRate || 0}/day
          </p>
          <div className="movie-card-meta">
            <div className="movie-rating">
              <i className="fa fa-star" style={{ color: "#fbbf24" }} />
              <span>{(movie.dailyRentalRate || 0).toFixed(1)}/5</span>
            </div>
            <div className="movie-likes">
              <Like
                liked={movie.liked}
                onClick={() => this.handleLike(movie)}
              />
              <span style={{ marginLeft: "4px" }}>
                {movie.liked ? "Liked" : "Like"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            {user && movie.numberInStock > 0 ? (
              <Link
                to={`/rentals/new?movieId=${movie._id}`}
                className="movie-card-button"
                style={{ flex: 1, textAlign: "center", textDecoration: "none" }}
              >
                Rent
              </Link>
            ) : (
              <Link
                to={`/movies/${movie._id}`}
                className="movie-card-button"
                style={{ flex: 1, textAlign: "center", textDecoration: "none" }}
              >
                View Details
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={() => this.handleDelete(movie)}
                className="btn btn-danger btn-sm"
                style={{ flex: "0 0 auto" }}
              >
                <i className="fa fa-trash" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, searchQuery, activeFilter, loading } = this.state;
    const { user } = this.props;

    if (loading) {
      return <LoadingSpinner />;
    }

    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div>
        {/* Hero Section - Only show on first page */}
        {currentPage === 1 && (
          <HeroSection />
        )}

        {/* Content Sections */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Movies</h2>
            {user && (
              <Link to="/movies/new" className="btn btn-primary">
                <i className="fa fa-plus" style={{ marginRight: "8px" }} />
                New Movie
              </Link>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeFilter === "Latest" ? "active" : ""}`}
              onClick={() => this.handleFilterChange("Latest")}
            >
              Latest
            </button>
            <button
              className={`filter-tab ${activeFilter === "Newest" ? "active" : ""}`}
              onClick={() => this.handleFilterChange("Newest")}
            >
              Newest
            </button>
            <button
              className={`filter-tab ${activeFilter === "Trending" ? "active" : ""}`}
              onClick={() => this.handleFilterChange("Trending")}
            >
              Trending
            </button>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {this.state.genres.map((genre) => (
              <span
                key={genre._id || "all"}
                className={`category-tab ${
                  this.state.selectedGenre === genre ? "active" : ""
                }`}
                onClick={() => this.handleGenreSelect(genre)}
                style={{ cursor: "pointer" }}
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Search Box */}
          <div className="search-box-container">
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
          </div>

          {/* Movies Count */}
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Showing {totalCount} {totalCount === 1 ? "movie" : "movies"} in the database.
          </p>

          {/* Movies Grid */}
          {count === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <i className="fa fa-film" style={{ fontSize: "4rem", marginBottom: "20px", display: "block" }} />
              <p style={{ fontSize: "1.2rem" }}>There are no movies in the database.</p>
              {user && (
                <Link to="/movies/new" className="btn btn-primary" style={{ marginTop: "20px" }}>
                  Add Your First Movie
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="movies-grid">
                {movies.map((movie) => this.renderMovieCard(movie))}
              </div>

              {/* Pagination */}
              {totalCount > pageSize && (
                <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
                  <Pagination
                    itemsCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Movies;
