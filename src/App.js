import React, { Component } from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Movies from "./components/movies";
import MoviesForm from "./components/movieForm";
import MovieDetail from "./components/movieDetail";
import Customers from "./components/customers";
import CustomerForm from "./components/customerForm";
import Rentals from "./components/rentals";
import RentalForm from "./components/rentalForm";
import RentalDetail from "./components/rentalDetail";
import Genres from "./components/genres";
import GenreForm from "./components/genreForm";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import auth from "./services/authService";
import RegisterForm from "./components/registerForm";
import Footer from "./components/footer";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import MovieForm from "./components/movieForm";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminRoute from "./components/common/adminRoute";
import UserManagement from "./components/userManagement";

class App extends Component {
  state = {};

  componentDidMount() {
    this.updateUser();
    // Listen for login/logout events
    window.addEventListener("userLogin", this.updateUser);
    window.addEventListener("userLogout", this.updateUser);
    // Also check user state when location changes
    this.unlisten = this.props.history.listen(() => {
      this.updateUser();
    });
  }

  componentWillUnmount() {
    window.removeEventListener("userLogin", this.updateUser);
    window.removeEventListener("userLogout", this.updateUser);
    if (this.unlisten) {
      this.unlisten();
    }
  }

  updateUser = () => {
    const user = auth.getCurrentUser();
    this.setState({ user });
  };

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container" style={{ paddingTop: "80px", minHeight: "calc(100vh - 200px)" }}>
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route 
              path="/login" 
              render={(props) => <LoginForm {...props} onLogin={this.updateUser} />} 
            />
            <Route 
              path="/logout" 
              render={(props) => <Logout {...props} onLogout={this.updateUser} />} 
            />
            <ProtectedRoute path="/movies/new" component={MovieForm} />
            <ProtectedRoute path="/movies/:id/edit" component={MovieForm} />
            <Route path="/movies/:id" component={MovieDetail} />
            <Route
              path="/movies"
              render={(props) => <Movies {...props} user={user} />}
            />
            <ProtectedRoute path="/customers/:id" component={CustomerForm} />
            <Route path="/customers" component={Customers} />
            <ProtectedRoute path="/rentals/new" component={RentalForm} />
            <ProtectedRoute path="/rentals/:id" component={RentalDetail} />
            <Route path="/rentals" component={Rentals} />
            <ProtectedRoute path="/genres/:id" component={GenreForm} />
            <Route path="/genres" component={Genres} />
            <AdminRoute path="/users" component={UserManagement} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(App);
