import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", padding: "80px 20px", minHeight: "60vh" }}>
            <div className="card" style={{ padding: "60px 40px", maxWidth: "600px", margin: "0 auto" }}>
                <i className="fa fa-exclamation-triangle" style={{ fontSize: "5rem", color: "var(--accent-primary)", marginBottom: "24px" }} />
                <h1 style={{ color: "var(--text-primary)", marginBottom: "16px", fontSize: "3rem" }}>404</h1>
                <h2 style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Page Not Found</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/movies" className="btn btn-primary">
                    <i className="fa fa-home" style={{ marginRight: "8px" }} />
                    Go to Home
                </Link>
            </div>
        </div>
    );
}
 
export default NotFound;