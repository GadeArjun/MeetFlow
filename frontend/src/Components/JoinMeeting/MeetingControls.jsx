// 📁 src/components/Meeting/MeetingControls.jsx
import React from "react";
import { Mic, Video, ScreenShare, Hand } from "lucide-react";
import "./MeetingControls.css";

const MeetingControls = () => {
  return (
    <div className="meeting-controls">
      <button>
        <Mic /> Mute
      </button>
      <button>
        <Video /> Camera
      </button>
      <button>
        <ScreenShare /> Share
      </button>
      <button>
        <Hand /> Raise Hand
      </button>
      <button className="leave-btn">Leave</button>
    </div>
  );
};

export default MeetingControls;
