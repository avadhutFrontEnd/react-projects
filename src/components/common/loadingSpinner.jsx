import React from "react";

const LoadingSpinner = ({ size = "medium", fullScreen = false }) => {
  const sizeClasses = {
    small: "spinner-border-sm",
    medium: "",
    large: "spinner-border-lg",
  };

  const spinner = (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: fullScreen ? "50vh" : "auto", padding: "20px" }}>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.1)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;

