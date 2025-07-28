// 📁 src/components/Meeting/TopMeetingBar.jsx
import React from "react";
import "./TopMeetingBar.css";

const TopMeetingBar = ({ roomName }) => {
  return (
    <div className="join-meeting-top-bar">
      <div className="top-left">
        <strong>{roomName}</strong>
      </div>
      <button className="end-meeting">End Meeting</button>
    </div>
  );
};

export default TopMeetingBar;
