import React, { Component } from "react";
import { getMovie } from "../services/movieService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "./common/loadingSpinner";
import auth from "../services/authService";
import { getMovieImage, getPlaceholderImage } from "../utils/imageHelper";

class MovieDetail extends Component {
  state = {
    movie: null,
    loading: true,
  };

  async componentDidMount() {
    await this.populateMovie();
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id;
      const { data: movie } = await getMovie(movieId);
      this.setState({ movie, loading: false });
    } catch (ex) {
      this.setState({ loading: false });
      if (ex.response && ex.response.status === 404) {
        toast.error("Movie not found");
        this.props.history.replace("/not-found");
      } else {
        toast.error("Error loading movie");
      }
    }
  }

  render() {
    const { movie, loading } = this.state;
    const user = auth.getCurrentUser();
    const isAdmin = user && user.isAdmin;

    if (loading) {
      return <LoadingSpinner />;
    }

    if (!movie) {
      return (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="card" style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ color: "var(--text-primary)", marginBottom: "20px" }}>
              Movie Not Found
            </h2>
            <Link to="/movies" className="btn btn-primary">
              Back to Movies
            </Link>
          </div>
        </div>
      );
    }

    const movieImage = getMovieImage(movie) || getPlaceholderImage(movie.title, 400, 600);

    return (
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
        <div className="card" style={{ padding: "40px" }}>
          {/* Header with Edit button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h1 style={{ color: "var(--text-primary)", margin: 0 }}>
              {movie.title}
            </h1>
            {user && (
              <Link
                to={`/movies/${movie._id}/edit`}
                className="btn btn-primary"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <i className="fa fa-pencil" />
                Edit
              </Link>
            )}
          </div>

          <div className="row">
            {/* Movie Image */}
            <div className="col-md-4" style={{ marginBottom: "30px" }}>
              <div
                style={{
                  width: "100%",
                  height: "500px",
                  backgroundImage: `url(${movieImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <div
                  className="badge"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: movie.numberInStock > 0 ? "#28a745" : "#dc3545",
                    padding: "8px 16px",
                    fontSize: "0.9rem",
                  }}
                >
                  {movie.numberInStock > 0 ? "In Stock" : "Out of Stock"}
                </div>
              </div>
            </div>

            {/* Movie Details */}
            <div className="col-md-8">
              <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "var(--text-primary)", marginBottom: "15px" }}>
                    Movie Information
                  </h3>
                  <div style={{ padding: "20px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
                    <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
                      <strong>Title:</strong> {movie.title}
                    </p>
                    <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
                      <strong>Genre:</strong>{" "}
                      <Link to={`/genres/${movie.genre._id}`} style={{ color: "var(--accent-primary)" }}>
                        {movie.genre.name}
                      </Link>
                    </p>
                    <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
                      <strong>Number in Stock:</strong> {movie.numberInStock}
                    </p>
                    <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
                      <strong>Daily Rental Rate:</strong> ${movie.dailyRentalRate.toFixed(2)}/day
                    </p>
                    {movie.publishDate && (
                      <p style={{ marginBottom: "0", fontSize: "1.1rem" }}>
                        <strong>Publish Date:</strong>{" "}
                        {new Date(movie.publishDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: "30px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {user && movie.numberInStock > 0 && (
                    <Link
                      to={`/rentals/new?movieId=${movie._id}`}
                      className="btn btn-success btn-lg"
                      style={{ flex: "1", minWidth: "200px", textAlign: "center", textDecoration: "none" }}
                    >
                      <i className="fa fa-shopping-cart" style={{ marginRight: "8px" }} />
                      Rent This Movie
                    </Link>
                  )}
                  {!user && (
                    <Link
                      to="/login"
                      className="btn btn-primary btn-lg"
                      style={{ flex: "1", minWidth: "200px", textAlign: "center", textDecoration: "none" }}
                    >
                      Login to Rent
                    </Link>
                  )}
                  {movie.numberInStock === 0 && (
                    <div className="alert alert-warning" style={{ width: "100%", margin: 0 }}>
                      This movie is currently out of stock.
                    </div>
                  )}
                  <Link
                    to="/movies"
                    className="btn btn-outline-primary btn-lg"
                    style={{ flex: "1", minWidth: "200px", textAlign: "center", textDecoration: "none" }}
                  >
                    <i className="fa fa-arrow-left" style={{ marginRight: "8px" }} />
                    Back to Movies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MovieDetail;

