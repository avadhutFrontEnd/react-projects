import React, { Component } from "react";
import { getCustomers, deleteCustomer } from "../services/customerService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "./common/table";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import LoadingSpinner from "./common/loadingSpinner";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import auth from "../services/authService";

class Customers extends Component {
  state = {
    customers: [],
    currentPage: 1,
    pageSize: 8,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
    loading: true,
  };

  columns = [
    {
      path: "name",
      label: "Name",
      content: (customer) => (
        <Link to={`/customers/${customer._id}`}>{customer.name}</Link>
      ),
    },
    { path: "phone", label: "Phone" },
    {
      key: "isGold",
      label: "Gold Member",
      content: (customer) => (
        <span>
          {customer.isGold ? (
            <i className="fa fa-star" style={{ color: "#fbbf24" }} />
          ) : (
            <i className="fa fa-star-o" style={{ color: "#ccc" }} />
          )}
        </span>
      ),
    },
    {
      key: "delete",
      content: (customer) => (
        <button
          onClick={() => this.handleDelete(customer)}
          className="btn btn-danger btn-sm"
        >
          <i className="fa fa-trash" />
        </button>
      ),
    },
  ];

  async componentDidMount() {
    try {
      const { data: customers } = await getCustomers();
      this.setState({ customers, loading: false });
    } catch (ex) {
      this.setState({ loading: false });
      if (ex.response && ex.response.status === 401) {
        toast.error("Please login to view customers");
      } else {
        toast.error("Error loading customers");
      }
    }
  }

  handleDelete = async (customer) => {
    const originalCustomers = this.state.customers;
    const customers = originalCustomers.filter((c) => c._id !== customer._id);
    this.setState({ customers });

    try {
      await deleteCustomer(customer._id);
      toast.success("Customer deleted successfully");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This customer has already been deleted.");
      else if (ex.response && ex.response.status === 401)
        toast.error("Please login to delete customers");
      else toast.error("Error deleting customer");

      this.setState({ customers: originalCustomers });
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

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      customers: allCustomers,
    } = this.state;

    let filtered = allCustomers;

    if (searchQuery) {
      filtered = allCustomers.filter(
        (c) =>
          c.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          c.phone.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const customers = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: customers };
  };

  render() {
    const { length: count } = this.state.customers;
    const { pageSize, currentPage, searchQuery, loading } = this.state;
    const user = auth.getCurrentUser();

    if (loading) {
      return <LoadingSpinner />;
    }

    const { totalCount, data: customers } = this.getPagedData();

    return (
      <div>
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Customers</h2>
            {user && (
              <Link to="/customers/new" className="btn btn-primary">
                <i className="fa fa-plus" style={{ marginRight: "8px" }} />
                New Customer
              </Link>
            )}
          </div>

          {/* Search Box */}
          <div className="search-box-container" style={{ marginBottom: "24px" }}>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
          </div>

          {/* Customers Count */}
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Showing {totalCount} {totalCount === 1 ? "customer" : "customers"} in
            the database.
          </p>

          {/* Customers Table */}
          {count === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-muted)",
              }}
            >
              <i
                className="fa fa-users"
                style={{ fontSize: "4rem", marginBottom: "20px", display: "block" }}
              />
              <p style={{ fontSize: "1.2rem" }}>
                There are no customers in the database.
              </p>
              {user && (
                <Link
                  to="/customers/new"
                  className="btn btn-primary"
                  style={{ marginTop: "20px" }}
                >
                  Add Your First Customer
                </Link>
              )}
            </div>
          ) : (
            <>
              <Table
                columns={this.columns}
                data={customers}
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

export default Customers;
