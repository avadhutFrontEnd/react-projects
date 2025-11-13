import React, { Component } from "react";
import {
  getUsers,
  verifyUser,
  revokeUser,
  activateUser,
  deleteUser,
  updateUserRole,
  updateUserCredits,
} from "../services/userService";
import { toast } from "react-toastify";
import Table from "./common/table";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import LoadingSpinner from "./common/loadingSpinner";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import auth from "../services/authService";

class UserManagement extends Component {
  state = {
    users: [],
    currentPage: 1,
    pageSize: 20,
    searchQuery: "",
    statusFilter: "all", // all, pending, active, revoked
    sortColumn: { path: "createdAt", order: "desc" },
    loading: true,
    statistics: {
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
      revokedUsers: 0,
    },
  };

  columns = [
    {
      path: "_id",
      label: "ID",
      content: (user) => `#${user._id.slice(-6)}`,
    },
    { path: "email", label: "Email" },
    { path: "name", label: "Name" },
    {
      key: "role",
      label: "Role",
      content: (user) => {
        const roleColors = {
          SuperAdmin: { bg: "#e5e7eb", text: "#374151" },
          Admin: { bg: "#dbeafe", text: "#1e40af" },
          Client: { bg: "#dcfce7", text: "#166534" },
          Designer: { bg: "#f3e8ff", text: "#6b21a8" },
        };
        const colors = roleColors[user.role] || roleColors.SuperAdmin;
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "600",
              backgroundColor: colors.bg,
              color: colors.text,
            }}
          >
            {user.role}
          </span>
        );
      },
    },
    {
      key: "credits",
      label: "Credits",
      content: (user) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="btn btn-sm"
            onClick={() => this.handleCreditsChange(user, "subtract")}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "2px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            -
          </button>
          <span style={{ minWidth: "60px", textAlign: "center" }}>
            {user.credits === "unlimited" || user.credits === Infinity
              ? "∞"
              : user.credits}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => this.handleCreditsChange(user, "add")}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              padding: "2px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      content: (user) => {
        const statusColors = {
          pending: { bg: "#fed7aa", text: "#9a3412" },
          active: { bg: "#bbf7d0", text: "#166534" },
          revoked: { bg: "#fecaca", text: "#991b1b" },
          rejected: { bg: "#e5e7eb", text: "#374151" },
        };
        const colors = statusColors[user.status] || statusColors.pending;
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "600",
              backgroundColor: colors.bg,
              color: colors.text,
            }}
          >
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        );
      },
    },
    {
      path: "createdAt",
      label: "Created",
      content: (user) => {
        if (!user.createdAt) return "N/A";
        const date = new Date(user.createdAt);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      key: "actions",
      label: "Actions",
      content: (user) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {user.status === "pending" && (
            <button
              className="btn btn-sm btn-success"
              onClick={() => this.handleVerify(user)}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                padding: "4px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Verify
            </button>
          )}
          {user.status === "active" && (
            <button
              className="btn btn-sm"
              onClick={() => this.handleRevoke(user)}
              style={{
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                padding: "4px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Revoke
            </button>
          )}
          {user.status === "revoked" && (
            <button
              className="btn btn-sm btn-success"
              onClick={() => this.handleActivate(user)}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                padding: "4px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Activate
            </button>
          )}
          <button
            className="btn btn-sm btn-danger"
            onClick={() => this.handleDelete(user)}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "4px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  async componentDidMount() {
    await this.loadUsers();
  }

  loadUsers = async () => {
    try {
      this.setState({ loading: true });
      const { statusFilter, searchQuery, currentPage, pageSize } = this.state;
      const filters = {
        page: currentPage,
        limit: pageSize,
      };

      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }

      if (searchQuery) {
        filters.search = searchQuery;
      }

      const response = await getUsers(filters);
      // Handle different response structures
      const responseData = response.data || response;
      const users = responseData.users || responseData.data || responseData || [];
      const statistics = responseData.statistics || responseData.pagination?.statistics || {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.status === "active").length,
        pendingUsers: users.filter((u) => u.status === "pending").length,
        revokedUsers: users.filter((u) => u.status === "revoked").length,
      };

      this.setState({
        users,
        statistics,
        loading: false,
      });
    } catch (ex) {
      this.setState({ loading: false });
      if (ex.response && ex.response.status === 401) {
        toast.error("Please login to view users");
      } else if (ex.response && ex.response.status === 403) {
        toast.error("Access denied. Admin privileges required.");
      } else {
        toast.error("Error loading users");
      }
    }
  };

  handleVerify = async (user) => {
    const originalUsers = this.state.users;
    const users = originalUsers.filter((u) => u._id !== user._id);
    this.setState({ users });

    try {
      const response = await verifyUser(user._id);
      toast.success("User verified successfully");
      await this.loadUsers();
    } catch (ex) {
      this.setState({ users: originalUsers });
      console.error("Verify user error:", ex);
      if (ex.response) {
        const status = ex.response.status;
        const errorMessage = ex.response.data?.error || ex.response.data?.message || ex.response.data;
        
        if (status === 400) {
          toast.error(errorMessage || "User is already verified");
        } else if (status === 401) {
          toast.error("Please login to verify users");
        } else if (status === 403) {
          toast.error("Access denied. Admin privileges required.");
        } else if (status === 404) {
          toast.error("User not found");
        } else {
          toast.error(errorMessage || `Error verifying user (${status})`);
        }
      } else {
        toast.error(ex.message || "Error verifying user. Please check your connection.");
      }
    }
  };

  handleRevoke = async (user) => {
    if (!window.confirm(`Are you sure you want to revoke access for ${user.name}?`)) {
      return;
    }

    const originalUsers = this.state.users;
    const users = originalUsers.filter((u) => u._id !== user._id);
    this.setState({ users });

    try {
      await revokeUser(user._id);
      toast.success("User access revoked successfully");
      await this.loadUsers();
    } catch (ex) {
      this.setState({ users: originalUsers });
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data?.error || "User is already revoked");
      } else {
        toast.error("Error revoking user access");
      }
    }
  };

  handleActivate = async (user) => {
    const originalUsers = this.state.users;
    const users = originalUsers.filter((u) => u._id !== user._id);
    this.setState({ users });

    try {
      await activateUser(user._id);
      toast.success("User reactivated successfully");
      await this.loadUsers();
    } catch (ex) {
      this.setState({ users: originalUsers });
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data?.error || "Error activating user");
      } else {
        toast.error("Error activating user");
      }
    }
  };

  handleDelete = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user ${user.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    const originalUsers = this.state.users;
    const users = originalUsers.filter((u) => u._id !== user._id);
    this.setState({ users });

    try {
      await deleteUser(user._id);
      toast.success("User deleted successfully");
      await this.loadUsers();
    } catch (ex) {
      this.setState({ users: originalUsers });
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data?.error || "Cannot delete this user");
      } else if (ex.response && ex.response.status === 404) {
        toast.error("User not found");
      } else {
        toast.error("Error deleting user");
      }
    }
  };

  handleCreditsChange = async (user, operation) => {
    if (user.credits === "unlimited" || user.credits === Infinity) {
      toast.info("User has unlimited credits");
      return;
    }

    const currentCredits = Number(user.credits) || 0;
    let newCredits;

    if (operation === "add") {
      newCredits = currentCredits + 10; // Add 10 credits
    } else if (operation === "subtract") {
      newCredits = Math.max(0, currentCredits - 10); // Subtract 10 credits, minimum 0
    } else {
      return;
    }

    try {
      await updateUserCredits(user._id, newCredits, "set");
      toast.success(`Credits updated to ${newCredits}`);
      await this.loadUsers();
    } catch (ex) {
      toast.error("Error updating credits");
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page }, () => {
      this.loadUsers();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 }, () => {
      this.loadUsers();
    });
  };

  handleStatusFilter = (status) => {
    this.setState({ statusFilter: status, currentPage: 1 }, () => {
      this.loadUsers();
    });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      users: allUsers,
    } = this.state;

    // If backend handles pagination, return as is
    if (allUsers.length <= pageSize) {
      const sorted = _.orderBy(
        allUsers,
        [sortColumn.path],
        [sortColumn.order]
      );
      return { totalCount: allUsers.length, data: sorted };
    }

    // Otherwise, handle pagination on frontend
    const sorted = _.orderBy(allUsers, [sortColumn.path], [sortColumn.order]);
    const users = paginate(sorted, currentPage, pageSize);

    return { totalCount: allUsers.length, data: users };
  };

  render() {
    const { users, pageSize, currentPage, searchQuery, loading, statistics, statusFilter } =
      this.state;
    const user = auth.getCurrentUser();

    if (loading) {
      return <LoadingSpinner />;
    }

    const { totalCount, data: displayUsers } = this.getPagedData();

    return (
      <div>
        <div className="content-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">User Management</h2>
              <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
                Manage user accounts, roles, and permissions
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="search-box-container" style={{ marginBottom: "24px" }}>
            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Search users..."
            />
          </div>

          {/* Statistics Card */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div
              className="card"
              style={{
                padding: "20px",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>
                Total Users
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: "8px 0 0 0",
                  color: "var(--text-primary)",
                }}
              >
                {statistics.totalUsers || users.length}
              </p>
            </div>
            <div
              className="card"
              style={{
                padding: "20px",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>
                Active Users
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: "8px 0 0 0",
                  color: "#10b981",
                }}
              >
                {statistics.activeUsers || users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div
              className="card"
              style={{
                padding: "20px",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>
                Pending Users
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: "8px 0 0 0",
                  color: "#f59e0b",
                }}
              >
                {statistics.pendingUsers || users.filter((u) => u.status === "pending").length}
              </p>
            </div>
          </div>

          {/* Status Filter */}
          <div style={{ marginBottom: "24px", display: "flex", gap: "8px" }}>
            <button
              className={`btn btn-sm ${statusFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => this.handleStatusFilter("all")}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${statusFilter === "pending" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => this.handleStatusFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`btn btn-sm ${statusFilter === "active" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => this.handleStatusFilter("active")}
            >
              Active
            </button>
            <button
              className={`btn btn-sm ${statusFilter === "revoked" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => this.handleStatusFilter("revoked")}
            >
              Revoked
            </button>
          </div>

          {/* Users Table */}
          {users.length === 0 ? (
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
              <p style={{ fontSize: "1.2rem" }}>No users found.</p>
            </div>
          ) : (
            <>
              <Table
                columns={this.columns}
                data={displayUsers}
                sortColumn={this.state.sortColumn}
                onSort={this.handleSort}
              />

              {/* Pagination */}
              <div
                style={{
                  marginTop: "40px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label>Show:</label>
                  <select
                    className="form-control"
                    style={{ width: "auto", display: "inline-block" }}
                    value={pageSize}
                    onChange={(e) =>
                      this.setState({ pageSize: parseInt(e.target.value), currentPage: 1 }, () =>
                        this.loadUsers()
                      )
                    }
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span style={{ color: "var(--text-secondary)" }}>
                    Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{" "}
                    {Math.min(currentPage * pageSize, totalCount)} of {totalCount} users
                  </span>
                </div>
                {totalCount > pageSize && (
                  <Pagination
                    itemsCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default UserManagement;

