import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";
import { toast } from "react-toastify";

class RegisterForm extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().email().label("Username"),
    password: Joi.string().required().min(5).label("Password"),
    name: Joi.string().required().label("Name"),
  };

  doSubmit = async () => {
    // Call the server
    try {
      const response = await userService.register(this.state.data);
      // Show success message
      toast.success("Registration successful! Your account is pending admin approval. You will be notified once your account is verified.");
      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  render() {
    return (
      <div style={{ maxWidth: "500px", margin: "60px auto", padding: "40px" }}>
        <div className="card" style={{ padding: "40px" }}>
          <h1 style={{ color: "var(--text-primary)", marginBottom: "30px", textAlign: "center" }}>
            Register
          </h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("username", "Email")}
            {this.renderInput("password", "Password", "password")}
            {this.renderInput("name", "Name")}
            <div style={{ marginTop: "24px" }}>
              {this.renderButton("Register")}
            </div>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)" }}>
                Already have an account?{" "}
                <a href="/login" style={{ color: "var(--accent-primary)" }}>
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
