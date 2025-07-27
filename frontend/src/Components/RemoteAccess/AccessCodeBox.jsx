import React from "react";
import { Copy, Share2, X } from "lucide-react";
import "./AccessCodeBox.css";

const AccessCodeBox = ({ accessCode, onEnd, showPermissions }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(accessCode);
    alert("Access Code Copied!");
  };

  const handleShare = () => {
    const text = `Join using this access code: ${accessCode}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="access-code-box">
      <h4>Access Code</h4>
      <div className="code-row">
        <span className="code-text">{accessCode}</span>
        <button onClick={handleCopy}>
          <Copy size={18} />
        </button>
        <button onClick={handleShare}>
          <Share2 size={18} />
        </button>
        <button onClick={onEnd}>
          <X size={18} />
        </button>
      </div>

      <ul className="permissions-list">
        {Object.entries(showPermissions)
          .filter(([_, val]) => val)
          .map(([key]) => (
            <li key={key}>{key.toUpperCase()} Enabled</li>
          ))}
      </ul>
    </div>
  );
};

export default AccessCodeBox;
