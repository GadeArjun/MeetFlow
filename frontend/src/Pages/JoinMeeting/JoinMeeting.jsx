// src/pages/JoinMeeting.jsx
import React, { useContext, useEffect, useState } from "react";
import { useMeeting } from "../../context/socket/MeetingSocketContext";
import { UserContext } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import VideoGrid from "../../Components/JoinMeeting/VideoGrid";
import TopMeetingBar from "../../Components/JoinMeeting/TopMeetingBar";
import "./JoinMeeting.css";
import MeetingControls from "../../Components/JoinMeeting/MeetingControls";
import Chat from "../../Components/JoinMeeting/Chat";
import ActivityToast from "../../Components/ActivityToast/ActivityToast";
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
    socket,
    participants,
    registerLocalScreenRef,
    sendMessage,
    messages,
    setMessageSenderName,
    messageSenderName,
    setUserJoinLeave,
    userJoinLeave,
  } = useMeeting();
  const { meetingID } = useParams();

  useEffect(() => {
    localStorage.setItem("meetingId", meetingID);
  }, [meetingID]);

  const { user, userContextLoading } = useContext(UserContext);
  const navigate = useNavigate();
  console.log({ user });
  // CORRECT WAY: Use useEffect to set state based on props after the component renders.
  useEffect(() => {
    if (!userContextLoading && !user) {
      navigate("/");
    }

    if (user && meetingID) {
      setUsername(user._id);
      setRoomId(meetingID);
      joinRoom(meetingID, user._id);
    }

    return () => {
      leaveMeeting();
      // socket.disconnect();
      setMessageSenderName("");
      setShowMessage(false);
      setUserJoinLeave({});
    };
  }, [user, meetingID, setUsername, setRoomId, userContextLoading]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (messageSenderName || userJoinLeave?.status) {
      setShowMessage(true);
    }
  }, [messageSenderName, userJoinLeave]);

  function onClose() {
    setMessageSenderName("");
    setShowMessage(false);
    setUserJoinLeave({});
  }
  console.log({ userJoinLeave });

  return (
    <div className="join-meeting-page-main">
      <TopMeetingBar
        leaveMeeting={leaveMeeting}
        roomName={roomId || meetingID}
      />

      <main className="meeting-main">
        {/* Video grid: remote participants + self popup */}
        <VideoGrid
          currentUserId={user?._id}
          registerLocalVideoRef={registerLocalVideoRef}
          localScreenRef={localScreenRef}
          remoteStreams={remoteStreams}
          remoteMediaStates={remoteMediaStates}
          localIsCameraOn={isCameraOn}
          localIsScreenSharing={isScreenSharing}
          participants={participants}
          socket={socket}
          registerLocalScreenRef={registerLocalScreenRef}
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
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
      />

      {/* Chat */}
      {isChatOpen && (
        <Chat
          isOpen={isChatOpen}
          toggleChat={toggleChat}
          messages={messages}
          onSendMessage={sendMessage}
          currentUser={user}
        />
      )}
      {showMessage && (
        <ActivityToast
          message={
            messageSenderName
              ? `${messageSenderName} sent a message`
              : userJoinLeave?.status === "joined"
              ? `${userJoinLeave?.username} joined`
              : userJoinLeave?.status === "leave"
              ? `${userJoinLeave?.username} left`
              : ""
          }
          onClose={onClose}
          type={messageSenderName ? "message" : userJoinLeave?.status || ""}
        />
      )}
    </div>
  );
};

export default JoinMeeting;
