import React from "react";
import { Copy, Share2 } from "lucide-react";
import "./PreviousSessions.css";

const PreviousSessions = ({ sessions }) => {
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert("Copied: " + code);
  };

  const handleShare = (code) => {
    const text = `Join my remote session using this code: ${code}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="previous-sessions">
      <h3>Previously Generated Access IDs</h3>
      <ul>
        {sessions.map((s, idx) => (
          <li key={idx} className="prev-item">
            <div>
              <strong>{s.code}</strong> <small>• {s.timestamp}</small>
            </div>
            <div className="prev-actions">
              <button onClick={() => handleCopy(s.code)}>
                <Copy size={16} />
              </button>
              <button onClick={() => handleShare(s.code)}>
                <Share2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreviousSessions;
