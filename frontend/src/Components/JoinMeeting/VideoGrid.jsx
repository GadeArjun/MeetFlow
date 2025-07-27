// 📁 src/components/Meeting/VideoGrid.jsx
import React from "react";
import "./VideoGrid.css";

const VideoGrid = ({ participants }) => {
  return (
    <div className="video-grid">
      {participants.map((user) => (
        <div className="video-tile" key={user.id}>
          <img src={user.image} alt={user.name} />
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
