// 📁 src/components/Meeting/ParticipantSidebar.jsx
import React from "react";
import "./ParticipantSidebar.css";

const ParticipantSidebar = () => {
  return (
    <div className="sidebar">
      <h4>Participants</h4>
      <ul>
        <li>🟢 A. soor</li>
        <li>🟢 A. doctor</li>
        <li>🔴 root</li>
      </ul>
      <hr />
      <h4>Remote Access Requests</h4>
      <ul>
        <li>
          root — <button>Approve</button>
        </li>
      </ul>
    </div>
  );
};

export default ParticipantSidebar;
