import React, { Component } from "react";
import Joi, { log } from "joi-browser";
import Form from "./common/form";
import Input from "./common/input";
import { keys } from "lodash";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    // Call the server
    try {
      const { data } = this.state;
      await auth.login(data.username, data.password);
      
      // Update user state immediately via callback
      if (this.props.onLogin) {
        this.props.onLogin();
      }
      
      // Also trigger custom event as backup
      window.dispatchEvent(new Event("userLogin"));
      
      // Use React Router navigation - force update by navigating
      const { state } = this.props.location;
      const redirectPath = state && state.from ? state.from.pathname : "/movies";
      
      // Navigate immediately - the history listener will update user state
      this.props.history.push(redirectPath);
    } catch (ex) {
      if (ex.response) {
        const status = ex.response.status;
        const errorMessage = ex.response.data?.error || ex.response.data;
        
        if (status === 403) {
          // Handle pending/revoked users
          const errors = { ...this.state.errors };
          errors.username = errorMessage;
          this.setState({ errors });
          toast.error(errorMessage);
        } else if (status === 400) {
          const errors = { ...this.state.errors };
          errors.username = errorMessage;
          this.setState({ errors });
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    
    return (
      <div style={{ maxWidth: "500px", margin: "60px auto", padding: "40px" }}>
        <div className="card" style={{ padding: "40px" }}>
          <h1 style={{ color: "var(--text-primary)", marginBottom: "30px", textAlign: "center" }}>
            Login
          </h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("username", "Username")}
            {this.renderInput("password", "Password", "password")}
            <div style={{ marginTop: "24px" }}>
              {this.renderButton("Login")}
            </div>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)" }}>
                Don't have an account?{" "}
                <a href="/register" style={{ color: "var(--accent-primary)" }}>
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
