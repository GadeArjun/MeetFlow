// 📁 src/pages/JoinMeeting/JoinMeeting.jsx
import React, { useEffect, useRef, useState } from "react";
import "./JoinMeeting.css";
import TopMeetingBar from "../../Components/JoinMeeting/TopMeetingBar";
import VideoGrid from "../../Components/JoinMeeting/VideoGrid";
import ParticipantSidebar from "../../Components/JoinMeeting/ParticipantSidebar";
import MeetingControls from "../../Components/JoinMeeting/MeetingControls";
import RemoteRequestPanel from "../../Components/JoinMeeting/RemoteRequestPanel";

const JoinMeeting = () => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  const participants = [
    { name: "A. Soor", id: "1", image: "/user1.png" },
    { name: "A. Doctor", id: "2", image: "/user2.png" },
    { name: "Root", id: "3", image: "/user3.png" },
    { name: "A. Robo", id: "4", image: "/user3.png" },
    { name: "A. Wontox", id: "5", image: "/user3.png" },
    { name: "A. Robo", id: "6", image: "/user3.png" },
    { name: "A. Wontox", id: "7", image: "/user3.png" },
  ];

  // ✅ Assign stream to video/audio elements after they are mounted
  useEffect(() => {
    if (localStream) {
      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }
      if (audioRef.current) {
        audioRef.current.srcObject = localStream;
      }
    }
  }, [localStream]);

  const handleEnableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream); // This will trigger the useEffect
    } catch (err) {
      console.error("Camera/mic access denied:", err);
    }
  };

  const handleStopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  };

  return (
    <div className="join-meeting-container">
      {/* Top Bar */}
      <TopMeetingBar roomName="Dev Team Daily Standup" />

      {/* Scrollable Split Body: Video + Sidebar */}
      <div className="join-meeting-body">
        {/* Left scrollable video area */}
        <div className="join-meeting-video-area">
          <VideoGrid
            participants={participants}
            localStream={localStream}
            videoRef={videoRef}
          />
        </div>

        {/* Right sidebar */}
        <ParticipantSidebar participants={participants} />
      </div>

      {/* Bottom controls */}
      <MeetingControls
        onStartCamera={handleEnableCamera}
        onStopCamera={handleStopCamera}
        isCameraOn={!!localStream}
      />

      {/* Remote access requests */}
      <RemoteRequestPanel />

      {/* Optional audio output (self) */}
      <audio ref={audioRef} autoPlay style={{ display: "none" }} />
    </div>
  );
};

export default JoinMeeting;
