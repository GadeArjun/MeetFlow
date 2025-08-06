// 📁 src/components/Meeting/TopMeetingBar.jsx
import React from "react";
import "./TopMeetingBar.css";
import { useNavigate } from "react-router-dom";

const TopMeetingBar = ({ roomName, leaveMeeting }) => {
  const navigate = useNavigate();
  return (
    <div className="join-meeting-top-bar">
      <div className="top-left">
        <strong>{roomName}</strong>
      </div>
      <button
        onClick={async () => {
          if (window.confirm("Leave meeting?")) {
            await leaveMeeting();
            navigate("/meetings");
          }
        }}
        className="end-meeting"
      >
        End Meeting
      </button>
    </div>
  );
};

export default TopMeetingBar;
