import React, { Component } from "react";
import { getRentals } from "../services/rentalService";
import { returnRental } from "../services/returnService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "./common/table";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import LoadingSpinner from "./common/loadingSpinner";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import auth from "../services/authService";

class Rentals extends Component {
  state = {
    rentals: [],
    currentPage: 1,
    pageSize: 8,
    searchQuery: "",
    sortColumn: { path: "dateOut", order: "desc" },
    filter: "all", // all, active, returned
    loading: true,
  };

  columns = [
    {
      path: "customer.name",
      label: "Customer",
      content: (rental) => (
        <Link to={`/rentals/${rental._id}`}>{rental.customer.name}</Link>
      ),
    },
    {
      path: "movie.title",
      label: "Movie",
      content: (rental) => (
        <Link to={`/rentals/${rental._id}`}>{rental.movie.title}</Link>
      ),
    },
    {
      path: "dateOut",
      label: "Date Out",
      content: (rental) => {
        if (!rental.dateOut) return "-";
        return new Date(rental.dateOut).toLocaleDateString();
      },
    },
    {
      path: "dateReturned",
      label: "Date Returned",
      content: (rental) => {
        if (!rental.dateReturned) return "-";
        return new Date(rental.dateReturned).toLocaleDateString();
      },
    },
    {
      key: "rentalFee",
      label: "Rental Fee",
      content: (rental) => {
        if (!rental.rentalFee) return "-";
        return `$${rental.rentalFee.toFixed(2)}`;
      },
    },
    {
      key: "status",
      label: "Status",
      content: (rental) => {
        if (rental.dateReturned) {
          return (
            <span className="badge badge-success" style={{ backgroundColor: "#28a745" }}>
              Returned
            </span>
          );
        }
        return (
          <span className="badge badge-warning" style={{ backgroundColor: "#ffc107" }}>
            Active
          </span>
        );
      },
    },
    {
      key: "return",
      label: "Action",
      content: (rental) => {
        if (rental.dateReturned) {
          return <span style={{ color: "var(--text-secondary)" }}>-</span>;
        }
        return (
          <button
            onClick={() => this.handleReturn(rental)}
            className="btn btn-success btn-sm"
          >
            Return
          </button>
        );
      },
    },
  ];

  async componentDidMount() {
    try {
      const { data: rentals } = await getRentals();
      this.setState({ rentals, loading: false });
    } catch (ex) {
      this.setState({ loading: false });
      if (ex.response && ex.response.status === 401) {
        toast.error("Please login to view rentals");
      } else {
        toast.error("Error loading rentals");
      }
    }
  }

  handleReturn = async (rental) => {
    const originalRentals = this.state.rentals;
    const rentals = originalRentals.map((r) =>
      r._id === rental._id ? { ...r, dateReturned: new Date(), rentalFee: 0 } : r
    );
    this.setState({ rentals });

    try {
      const { data: returnedRental } = await returnRental(
        rental.customer._id,
        rental.movie._id
      );
      
      // Update the rental with the returned data
      const updatedRentals = this.state.rentals.map((r) =>
        r._id === rental._id ? returnedRental : r
      );
      this.setState({ rentals: updatedRentals });
      
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
      this.setState({ rentals: originalRentals });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleFilterChange = (filter) => {
    this.setState({ filter, currentPage: 1 });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      filter,
      rentals: allRentals,
    } = this.state;

    let filtered = allRentals;

    // Filter by status
    if (filter === "active") {
      filtered = allRentals.filter((r) => !r.dateReturned);
    } else if (filter === "returned") {
      filtered = allRentals.filter((r) => r.dateReturned);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const rentals = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: rentals };
  };

  render() {
    const { length: count } = this.state.rentals;
    const { pageSize, currentPage, searchQuery, filter, loading } = this.state;
    const user = auth.getCurrentUser();

    if (loading) {
      return <LoadingSpinner />;
    }

    const { totalCount, data: rentals } = this.getPagedData();

    const activeCount = this.state.rentals.filter((r) => !r.dateReturned).length;
    const returnedCount = this.state.rentals.filter((r) => r.dateReturned).length;

    return (
      <div>
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Rentals</h2>
            {user && (
              <Link to="/rentals/new" className="btn btn-primary">
                <i className="fa fa-plus" style={{ marginRight: "8px" }} />
                New Rental
              </Link>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs" style={{ marginBottom: "24px" }}>
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => this.handleFilterChange("all")}
            >
              All ({this.state.rentals.length})
            </button>
            <button
              className={`filter-tab ${filter === "active" ? "active" : ""}`}
              onClick={() => this.handleFilterChange("active")}
            >
              Active ({activeCount})
            </button>
            <button
              className={`filter-tab ${filter === "returned" ? "active" : ""}`}
              onClick={() => this.handleFilterChange("returned")}
            >
              Returned ({returnedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="search-box-container" style={{ marginBottom: "24px" }}>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
          </div>

          {/* Rentals Count */}
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Showing {totalCount} {totalCount === 1 ? "rental" : "rentals"} in the
            database.
          </p>

          {/* Rentals Table */}
          {count === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-muted)",
              }}
            >
              <i
                className="fa fa-film"
                style={{ fontSize: "4rem", marginBottom: "20px", display: "block" }}
              />
              <p style={{ fontSize: "1.2rem" }}>
                There are no rentals in the database.
              </p>
              {user && (
                <Link
                  to="/rentals/new"
                  className="btn btn-primary"
                  style={{ marginTop: "20px" }}
                >
                  Create Your First Rental
                </Link>
              )}
            </div>
          ) : (
            <>
              <Table
                columns={this.columns}
                data={rentals}
                sortColumn={this.state.sortColumn}
                onSort={this.handleSort}
              />

              {/* Pagination */}
              {totalCount > pageSize && (
                <div
                  style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}
                >
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

export default Rentals;
