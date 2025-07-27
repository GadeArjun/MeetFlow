// 📁 src/components/Meeting/RemoteRequestPanel.jsx
import React from "react";
import { Monitor, XCircle } from "lucide-react";
import "./RemoteRequestPanel.css";

const RemoteRequestPanel = ({ onEndRemote }) => {
  return (
    <div className="remote-request-panel">
      <div className="remote-status">
        <Monitor size={20} className="remote-icon" />
        <p>
          Remote Access Mode is <strong>Active</strong>
        </p>
      </div>
      <button className="end-remote-btn" onClick={onEndRemote}>
        <XCircle size={16} /> End Remote Access
      </button>
    </div>
  );
};

export default RemoteRequestPanel;
