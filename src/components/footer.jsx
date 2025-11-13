import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h5 style={{ color: "var(--accent-primary)", marginBottom: "16px" }}>
              VIDLY
            </h5>
            <p>
              <i className="fa fa-map-marker" style={{ marginRight: "8px", color: "var(--accent-primary)" }} />
              123 Entertainment Street, Movie City, MC 12345
            </p>
            <h6 style={{ color: "var(--text-primary)", marginTop: "20px", marginBottom: "12px" }}>
              Security & Privacy
            </h6>
            <p>
              <i className="fa fa-envelope" style={{ marginRight: "8px", color: "var(--accent-primary)" }} />
              support@vidly.com
            </p>
            <p>
              <i className="fa fa-phone" style={{ marginRight: "8px", color: "var(--accent-primary)" }} />
              +1 (555) 123-4567
            </p>
          </div>

          <div className="footer-section">
            <h5>Find Us</h5>
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <a href="#" style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>
                <i className="fa fa-facebook" />
              </a>
              <a href="#" style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>
                <i className="fa fa-twitter" />
              </a>
              <a href="#" style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>
                <i className="fa fa-instagram" />
              </a>
              <a href="#" style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>
                <i className="fa fa-youtube-play" />
              </a>
              <a href="#" style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>
                <i className="fa fa-tiktok" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h5>VIDLY (On-Demand Movie & TV Streaming Service)</h5>
            <p style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
              Your ultimate destination for entertainment. Stream the latest movies and TV shows
              anytime, anywhere. Premium content at your fingertips.
            </p>
            <h6 style={{ color: "var(--text-primary)", marginTop: "20px", marginBottom: "12px" }}>
              Financial Partner
            </h6>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={{
                padding: "8px 16px",
                background: "var(--bg-card)",
                borderRadius: "4px",
                color: "var(--text-secondary)",
                fontSize: "0.85rem"
              }}>
                BCA
              </div>
              <div style={{
                padding: "8px 16px",
                background: "var(--bg-card)",
                borderRadius: "4px",
                color: "var(--text-secondary)",
                fontSize: "0.85rem"
              }}>
                Mandiri
              </div>
              <div style={{
                padding: "8px 16px",
                background: "var(--bg-card)",
                borderRadius: "4px",
                color: "var(--text-secondary)",
                fontSize: "0.85rem"
              }}>
                BNI
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          Copyright © 2025 VIDLY - Movie Rental Management System. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

