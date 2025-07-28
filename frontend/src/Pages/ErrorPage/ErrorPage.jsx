import React, { useState } from "react";
import {
  AlertCircle,
  Home,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./ErrorPage.css";

const ErrorPage = ({
  code = 500,
  message = "Something went wrong!",
  error,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="error-container">
      <div className="error-box">
        <AlertCircle size={48} className="error-icon" />
        <h1 className="error-code">Error {code}</h1>
        <p className="error-message">{message}</p>

        <div className="error-actions">
          <button
            className="error-btn"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={18} />
            <span>Retry</span>
          </button>

          <a className="error-btn outline" href="/">
            <Home size={18} />
            <span>Go Home</span>
          </a>
        </div>

        {error && (
          <>
            <button
              className="toggle-details"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info size={16} />
              <span>Details</span>
              {showDetails ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {showDetails && (
              <div className="error-details">
                <pre>{error.toString()}</pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
