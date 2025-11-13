import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { createRental } from "../services/rentalService";
import { getCustomers } from "../services/customerService";
import { getMovies } from "../services/movieService";
import { toast } from "react-toastify";

class RentalForm extends Form {
  state = {
    data: {
      customerId: "",
      movieId: "",
    },
    customers: [],
    movies: [],
    errors: {},
  };

  schema = {
    customerId: Joi.string().required().label("Customer"),
    movieId: Joi.string().required().label("Movie"),
  };

  async populateData() {
    try {
      const [customersResponse, moviesResponse] = await Promise.all([
        getCustomers(),
        getMovies(),
      ]);

      const customers = customersResponse.data;
      // Filter movies to only show those in stock
      const movies = moviesResponse.data.filter((m) => m.numberInStock > 0);

      // Check if movieId is provided in URL query params
      const movieId = new URLSearchParams(this.props.location.search).get("movieId");
      const data = { customerId: "", movieId: "" };
      
      if (movieId) {
        // Check if the movie is in the available movies list
        const movie = movies.find(m => m._id === movieId);
        if (movie) {
          data.movieId = movieId;
        }
      }

      this.setState({ customers, movies, data });
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        toast.error("Please login to create rentals");
      } else {
        toast.error("Error loading data");
      }
    }
  }

  async componentDidMount() {
    await this.populateData();
  }

  mapToSelectOptions(items, idKey = "_id", labelKey = "name") {
    return items.map((item) => ({
      _id: item[idKey],
      name: item[labelKey],
    }));
  }

  doSubmit = async () => {
    try {
      await createRental(this.state.data);
      toast.success("Movie rented successfully");
      this.props.history.push("/rentals");
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          const errorMessage = ex.response.data;
          const errors = { ...this.state.errors };
          if (typeof errorMessage === "string") {
            if (errorMessage.includes("customer")) {
              errors.customerId = errorMessage;
            } else if (errorMessage.includes("movie")) {
              errors.movieId = errorMessage;
            } else if (errorMessage.includes("stock")) {
              errors.movieId = errorMessage;
            } else {
              errors.customerId = errorMessage;
            }
          }
          this.setState({ errors });
          toast.error(errorMessage);
        } else if (ex.response.status === 401) {
          toast.error("Please login to create rentals");
        } else {
          toast.error("Error creating rental");
        }
      }
    }
  };

  render() {
    const customerOptions = this.mapToSelectOptions(this.state.customers);
    const movieOptions = this.mapToSelectOptions(this.state.movies, "_id", "title");

    return (
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
        <div className="card" style={{ padding: "40px" }}>
          <h1 style={{ color: "var(--text-primary)", marginBottom: "30px" }}>
            New Rental
          </h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderSelect("customerId", "Customer", customerOptions)}
            {this.renderSelect("movieId", "Movie", movieOptions)}
            {this.state.movies.length === 0 && (
              <div className="alert alert-warning">
                No movies available in stock. Please add movies with stock first.
              </div>
            )}
            <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
              {this.renderButton("Rent Movie")}
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => this.props.history.push("/rentals")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RentalForm;

