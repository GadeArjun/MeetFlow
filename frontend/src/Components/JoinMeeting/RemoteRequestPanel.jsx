// 📁 src/components/Meeting/RemoteRequestPanel.jsx
import React from "react";
import "./RemoteRequestPanel.css";

const RemoteRequestPanel = () => {
  return (
    <div className="remote-request-panel">
      <p>🖥️ Remote Access Mode Active</p>
      <button className="end-btn">End Remote Access</button>
    </div>
  );
};

export default RemoteRequestPanel;
