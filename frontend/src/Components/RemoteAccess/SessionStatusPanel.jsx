// 📁 src/components/RemoteAccess/SessionStatusPanel.jsx
import React from "react";
import { XCircle } from "lucide-react";
import "./SessionStatusPanel.css";

const SessionStatusPanel = ({ session, onEnd }) => {
  return (
    <div className="session-panel">
      <div>
        <h4>Connected to: {session.code}</h4>
        <p>Status: {session.status}</p>
      </div>
      <button className="end-btn" onClick={onEnd}>
        <XCircle size={18} /> End Session
      </button>
    </div>
  );
};

export default SessionStatusPanel;
