import React from "react";
import "./FullScreenLoader.css"; // Import the CSS file
import desklyLogo from "../../assets/images/logo.png"; // Import your logo (adjust path/name)

const FullScreenLoader = () => {
  return (
    <div
      className="fullscreen-loader-overlay"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="loader-container">
        {/* Deskly Logo */}
        <img src={desklyLogo} alt="Deskly Logo" className="loader-logo" />

        {/* Super Circular Loader (Chosen from previous options) */}
        <div className="super-circular-loader">
          <div className="loader-inner-circle"></div>
          <div className="loader-outer-ring"></div>
          <div className="loader-fill-arc"></div>
        </div>
        <p className="loading-text-super">Loading Deskly...</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
