import React from "react";
import "./FullScreenLoader.css";
import meetFlowLogo from "../../assets/images/name_logo.png";
import meetFlowFavicon from "../../assets/images/favicon.png";

const FullScreenLoader = ({ message = "Loading MeetFlow..." }) => {
  return (
    <div
      className="fullscreen-loader-overlay"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="loader-container">
        <div className="loader-logo-group">
          {/* Rotating Favicon */}
          <div className="logo-spinner">
            <img
              src={meetFlowFavicon}
              alt="MeetFlow Icon"
              className="loader-favicon"
            />
          </div>
          {/* Static Name Logo */}
          <img
            src={meetFlowLogo}
            alt="MeetFlow Logo"
            className="loader-logo-name"
          />
        </div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
