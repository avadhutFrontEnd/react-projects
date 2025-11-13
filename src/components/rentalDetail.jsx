import React, { Component } from "react";
import { getRental } from "../services/rentalService";
import { returnRental } from "../services/returnService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "./common/loadingSpinner";

class RentalDetail extends Component {
  state = {
    rental: null,
    loading: true,
  };

  async componentDidMount() {
    await this.populateRental();
  }

  async populateRental() {
    try {
      const rentalId = this.props.match.params.id;
      const { data: rental } = await getRental(rentalId);
      this.setState({ rental, loading: false });
    } catch (ex) {
      this.setState({ loading: false });
      if (ex.response && ex.response.status === 404) {
        toast.error("Rental not found");
        this.props.history.replace("/not-found");
      } else if (ex.response && ex.response.status === 401) {
        toast.error("Please login to view rental details");
        this.props.history.replace("/login");
      } else {
        toast.error("Error loading rental");
      }
    }
  }

  handleReturn = async () => {
    const { rental } = this.state;
    if (!rental || rental.dateReturned) return;

    try {
      const { data: returnedRental } = await returnRental(
        rental.customer._id,
        rental.movie._id
      );
      
      this.setState({ rental: returnedRental });
      toast.success(
        `Movie returned successfully. Rental fee: $${returnedRental.rentalFee.toFixed(2)}`
      );
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          toast.error(ex.response.data || "Error returning rental");
        } else if (ex.response.status === 404) {
          toast.error("Rental not found");
        } else if (ex.response.status === 401) {
          toast.error("Please login to return rentals");
        } else {
          toast.error("Error returning rental");
        }
      }
    }
  };

  calculateDaysRented = () => {
    const { rental } = this.state;
    if (!rental || !rental.dateOut) return 0;

    const dateOut = new Date(rental.dateOut);
    const dateReturned = rental.dateReturned ? new Date(rental.dateReturned) : new Date();
    const diffTime = Math.abs(dateReturned - dateOut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  render() {
    const { rental, loading } = this.state;

    if (loading) {
      return <LoadingSpinner />;
    }

    if (!rental) {
      return (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="card" style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ color: "var(--text-primary)", marginBottom: "20px" }}>
              Rental Not Found
            </h2>
            <Link to="/rentals" className="btn btn-primary">
              Back to Rentals
            </Link>
          </div>
        </div>
      );
    }

    const daysRented = this.calculateDaysRented();
    const isReturned = !!rental.dateReturned;

    return (
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
        <div className="card" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h1 style={{ color: "var(--text-primary)", margin: 0 }}>
              Rental Details
            </h1>
            <Link to="/rentals" className="btn btn-outline-primary">
              <i className="fa fa-arrow-left" style={{ marginRight: "8px" }} />
              Back to Rentals
            </Link>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <div
              className={`badge ${isReturned ? "badge-success" : "badge-warning"}`}
              style={{
                backgroundColor: isReturned ? "#28a745" : "#ffc107",
                padding: "8px 16px",
                fontSize: "1rem",
              }}
            >
              {isReturned ? "Returned" : "Active"}
            </div>
          </div>

          <div className="row" style={{ marginBottom: "30px" }}>
            <div className="col-md-6" style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "var(--text-primary)", marginBottom: "15px", fontSize: "1.3rem" }}>
                Customer Information
              </h3>
              <div style={{ padding: "20px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
                <p style={{ marginBottom: "10px" }}>
                  <strong>Name:</strong>{" "}
                  <Link to={`/customers/${rental.customer._id}`} style={{ color: "var(--accent-primary)" }}>
                    {rental.customer.name}
                  </Link>
                </p>
                <p style={{ marginBottom: "10px" }}>
                  <strong>Phone:</strong> {rental.customer.phone}
                </p>
                <p style={{ marginBottom: "0" }}>
                  <strong>Gold Member:</strong>{" "}
                  {rental.customer.isGold ? (
                    <i className="fa fa-star" style={{ color: "#fbbf24" }} />
                  ) : (
                    <i className="fa fa-star-o" style={{ color: "#ccc" }} />
                  )}
                </p>
              </div>
            </div>

            <div className="col-md-6" style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "var(--text-primary)", marginBottom: "15px", fontSize: "1.3rem" }}>
                Movie Information
              </h3>
              <div style={{ padding: "20px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
                <p style={{ marginBottom: "10px" }}>
                  <strong>Title:</strong>{" "}
                  <Link to={`/movies/${rental.movie._id}`} style={{ color: "var(--accent-primary)" }}>
                    {rental.movie.title}
                  </Link>
                </p>
                <p style={{ marginBottom: "10px" }}>
                  <strong>Daily Rental Rate:</strong> ${rental.movie.dailyRentalRate.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "15px", fontSize: "1.3rem" }}>
              Rental Information
            </h3>
            <div style={{ padding: "20px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
              <div className="row">
                <div className="col-md-6" style={{ marginBottom: "15px" }}>
                  <p style={{ marginBottom: "10px" }}>
                    <strong>Date Out:</strong>{" "}
                    {rental.dateOut
                      ? new Date(rental.dateOut).toLocaleString()
                      : "-"}
                  </p>
                </div>
                <div className="col-md-6" style={{ marginBottom: "15px" }}>
                  <p style={{ marginBottom: "10px" }}>
                    <strong>Date Returned:</strong>{" "}
                    {rental.dateReturned
                      ? new Date(rental.dateReturned).toLocaleString()
                      : "Not returned yet"}
                  </p>
                </div>
                <div className="col-md-6" style={{ marginBottom: "15px" }}>
                  <p style={{ marginBottom: "10px" }}>
                    <strong>Days Rented:</strong> {daysRented} {daysRented === 1 ? "day" : "days"}
                  </p>
                </div>
                <div className="col-md-6" style={{ marginBottom: "15px" }}>
                  <p style={{ marginBottom: "10px" }}>
                    <strong>Rental Fee:</strong>{" "}
                    {rental.rentalFee ? (
                      <span style={{ color: "var(--accent-primary)", fontWeight: "bold", fontSize: "1.2rem" }}>
                        ${rental.rentalFee.toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-secondary)" }}>
                        ${(daysRented * rental.movie.dailyRentalRate).toFixed(2)} (estimated)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isReturned && (
            <div style={{ marginTop: "30px", paddingTop: "30px", borderTop: "1px solid var(--border-color)" }}>
              <button
                onClick={this.handleReturn}
                className="btn btn-success btn-lg"
                style={{ width: "100%" }}
              >
                <i className="fa fa-check" style={{ marginRight: "8px" }} />
                Return Movie
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RentalDetail;

