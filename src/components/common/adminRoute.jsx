import React from "react";
import { Redirect, Route } from "react-router-dom";
import auth from "../../services/authService";
import { toast } from "react-toastify";

const AdminRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = auth.getCurrentUser();

        // First check if user is authenticated
        if (!user) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        }

        // Then check if user is admin
        if (!user.isAdmin) {
          toast.error("Access denied. Admin privileges required.");
          return <Redirect to="/" />;
        }

        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default AdminRoute;

