// 📁 src/pages/JoinMeeting/JoinMeeting.jsx
import React, { useState } from "react";
import "./JoinMeeting.css";
import TopMeetingBar from "../../Components/JoinMeeting/TopMeetingBar";
import VideoGrid from "../../Components/JoinMeeting/VideoGrid";
import ParticipantSidebar from "../../Components/JoinMeeting/ParticipantSidebar";
import MeetingControls from "../../Components/JoinMeeting/MeetingControls";
import RemoteRequestPanel from "../../Components/JoinMeeting/RemoteRequestPanel";


const JoinMeeting = () => {
  const [participants] = useState([
    { name: "A. soor", id: "1", image: "/user1.png" },
    { name: "A. doctor", id: "2", image: "/user2.png" },
    { name: "root", id: "3", image: "/user3.png" },
    { name: "A. robo", id: "4", image: "/user4.png" },
    { name: "A. wontox", id: "5", image: "/user5.png" },
    { name: "A. me", id: "6", image: "/user6.png" },
  ]);

  return (
    <div className="meeting-container">
      <TopMeetingBar roomName="Room Title" />
      <div className="meeting-body">
        <VideoGrid participants={participants} />
        <ParticipantSidebar />
      </div>
      <MeetingControls />
      <RemoteRequestPanel />
    </div>
  );
};

export default JoinMeeting;
