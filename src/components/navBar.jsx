import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-custom fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ textDecoration: "none" }}>
          <img 
            src="/images/hero/favicon-32.png" 
            alt="Vidly Logo" 
            style={{ 
              width: "32px", 
              height: "32px", 
              marginRight: "",
              borderRadius: "4px"
            }} 
          />
          <span style={{ color: "var(--accent-primary)", fontWeight: "bold", fontSize: "1.5rem" }}>
            idly
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: "rgba(139, 92, 246, 0.5)" }}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav mr-auto">
            <NavLink className="nav-item nav-link" to="/movies" exact>
              Home
            </NavLink>
            <NavLink className="nav-item nav-link" to="/movies">
              Movies
            </NavLink>
            <NavLink className="nav-item nav-link" to="/customers">
              Customers
            </NavLink>
            <NavLink className="nav-item nav-link" to="/rentals">
              Rentals
            </NavLink>
            <NavLink className="nav-item nav-link" to="/genres">
              Genres
            </NavLink>
            {user && (
              <NavLink className="nav-item nav-link" to="/movies/new">
                Add Movie
              </NavLink>
            )}
          </div>
          <div className="navbar-nav ml-auto d-flex align-items-center">
            <div className="nav-item mr-3" style={{ cursor: "pointer" }}>
              <i className="fa fa-search" style={{ color: "var(--text-primary)", fontSize: "1.2rem" }} />
            </div>
            {!user && (
              <React.Fragment>
                <NavLink className="nav-item nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="nav-item nav-link" to="/register">
                  <button className="btn btn-primary btn-sm" style={{ marginLeft: "8px" }}>
                    Registration
                  </button>
                </NavLink>
              </React.Fragment>
            )}
            {user && (
              <React.Fragment>
                <NavLink className="nav-item nav-link" to="/profile">
                  {user.name}
                </NavLink>
                <NavLink className="nav-item nav-link" to="/logout">
                  Logout
                </NavLink>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
