// src/pages/JoinMeeting.jsx
import React, { useContext, useEffect, useState } from "react";
import { useMeeting } from "../../context/socket/MeetingSocketContext";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import VideoGrid from "../../Components/JoinMeeting/VideoGrid";
import TopMeetingBar from "../../Components/JoinMeeting/TopMeetingBar";
import "./JoinMeeting.css";
import MeetingControls from "../../Components/JoinMeeting/MeetingControls";
const JoinMeeting = () => {
  const {
    setRoomId,
    setUsername,
    joinRoom,
    registerLocalVideoRef,
    localScreenRef,
    toggleCamera,
    toggleMic,
    toggleScreenShare,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    remoteStreams,
    remoteMediaStates,
    roomId,
    username,
    joined,
    setIsCameraOn,
    setIsMicOn,
    leaveMeeting,
  } = useMeeting();
  const { meetingID } = useParams();
  const { user } = useContext(UserContext);

  // CORRECT WAY: Use useEffect to set state based on props after the component renders.
  useEffect(() => {
    if (user && meetingID) {
      setUsername(user._id);
      setRoomId(meetingID);
      joinRoom();
    }
  }, [user, meetingID, setUsername, setRoomId]);

  return (
    <div className="join-meeting-page-main">
      <TopMeetingBar
        leaveMeeting={leaveMeeting}
        roomName={roomId || meetingID}
      />

      <main className="meeting-main">
        {/* Video grid: remote participants + self popup */}
        <VideoGrid
          currentUserId={user._id}
          registerLocalVideoRef={registerLocalVideoRef}
          localScreenRef={localScreenRef}
          remoteStreams={remoteStreams}
          remoteMediaStates={remoteMediaStates}
          localIsCameraOn={isCameraOn}
          localIsScreenSharing={isScreenSharing}
        />
      </main>

      {/* Persistent bottom controls */}
      <MeetingControls
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        isScreenSharing={isScreenSharing}
        toggleCamera={toggleCamera}
        toggleMic={toggleMic}
        toggleScreenSharing={toggleScreenShare}
        leaveMeeting={leaveMeeting}
      />
    </div>
  );
};

export default JoinMeeting;
