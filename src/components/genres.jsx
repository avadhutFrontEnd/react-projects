import React, { Component } from "react";
import { getGenres, deleteGenre } from "../services/genreService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "./common/table";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import LoadingSpinner from "./common/loadingSpinner";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import auth from "../services/authService";

class Genres extends Component {
  state = {
    genres: [],
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
      content: (genre) => (
        <Link to={`/genres/${genre._id}`}>{genre.name}</Link>
      ),
    },
    {
      key: "delete",
      label: "Action",
      content: (genre) => {
        const user = auth.getCurrentUser();
        const isAdmin = user && user.isAdmin;
        
        if (!isAdmin) return null;
        
        return (
          <button
            onClick={() => this.handleDelete(genre)}
            className="btn btn-danger btn-sm"
          >
            <i className="fa fa-trash" />
          </button>
        );
      },
    },
  ];

  async componentDidMount() {
    try {
      const { data: genres } = await getGenres();
      this.setState({ genres, loading: false });
    } catch (ex) {
      this.setState({ loading: false });
      if (ex.response && ex.response.status === 401) {
        toast.error("Please login to view genres");
      } else {
        toast.error("Error loading genres");
      }
    }
  }

  handleDelete = async (genre) => {
    const originalGenres = this.state.genres;
    const genres = originalGenres.filter((g) => g._id !== genre._id);
    this.setState({ genres });

    try {
      await deleteGenre(genre._id);
      toast.success("Genre deleted successfully");
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 404) {
          toast.error("This genre has already been deleted.");
        } else if (ex.response.status === 401) {
          toast.error("Please login to delete genres");
        } else if (ex.response.status === 403) {
          toast.error("Access denied. Admin privileges required.");
        } else {
          toast.error("Error deleting genre");
        }
      }
      this.setState({ genres: originalGenres });
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
      genres: allGenres,
    } = this.state;

    let filtered = allGenres;

    if (searchQuery) {
      filtered = allGenres.filter((g) =>
        g.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const genres = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: genres };
  };

  render() {
    const { length: count } = this.state.genres;
    const { pageSize, currentPage, searchQuery, loading } = this.state;
    const user = auth.getCurrentUser();

    if (loading) {
      return <LoadingSpinner />;
    }

    const { totalCount, data: genres } = this.getPagedData();

    return (
      <div>
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Genres</h2>
            {user && (
              <Link to="/genres/new" className="btn btn-primary">
                <i className="fa fa-plus" style={{ marginRight: "8px" }} />
                New Genre
              </Link>
            )}
          </div>

          {/* Search Box */}
          <div className="search-box-container" style={{ marginBottom: "24px" }}>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
          </div>

          {/* Genres Count */}
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Showing {totalCount} {totalCount === 1 ? "genre" : "genres"} in the
            database.
          </p>

          {/* Genres Table */}
          {count === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-muted)",
              }}
            >
              <i
                className="fa fa-tags"
                style={{ fontSize: "4rem", marginBottom: "20px", display: "block" }}
              />
              <p style={{ fontSize: "1.2rem" }}>
                There are no genres in the database.
              </p>
              {user && (
                <Link
                  to="/genres/new"
                  className="btn btn-primary"
                  style={{ marginTop: "20px" }}
                >
                  Add Your First Genre
                </Link>
              )}
            </div>
          ) : (
            <>
              <Table
                columns={this.columns}
                data={genres}
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

export default Genres;

