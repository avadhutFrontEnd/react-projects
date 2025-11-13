import React, { Component } from "react";
import auth from "../services/authService";

class Logout extends Component {
  componentDidMount() {
    auth.logout();
    // Update user state via callback if provided
    if (this.props.onLogout) {
      this.props.onLogout();
    }
    // Trigger a custom event to update App component's user state
    window.dispatchEvent(new Event("userLogout"));
    // Use React Router navigation
    setTimeout(() => {
      this.props.history.push("/");
    }, 100);
  }

  render() {
    return null;
  }
}

export default Logout;
