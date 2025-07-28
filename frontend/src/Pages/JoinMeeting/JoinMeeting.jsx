// 📁 src/pages/JoinMeeting/JoinMeeting.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import "./JoinMeeting.css";
import { useParams } from "react-router-dom";

import TopMeetingBar from "../../Components/JoinMeeting/TopMeetingBar";
import VideoGrid from "../../Components/JoinMeeting/VideoGrid";
import ParticipantSidebar from "../../Components/JoinMeeting/ParticipantSidebar";
import MeetingControls from "../../Components/JoinMeeting/MeetingControls";
import RemoteRequestPanel from "../../Components/JoinMeeting/RemoteRequestPanel";

import { useMeetingSocket } from "../../context/socket/MeetingSocketContext";
import { UserContext } from "../../context/UserContext";

const JoinMeeting = () => {
  const { meetingID } = useParams();
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  // const [localStream, setLocalStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const {
    joinMeeting,
    leaveMeeting,
    participantsList,
    remoteStreams,
    isConnected,
    updateTracksForAllPeers,
  } = useMeetingSocket();

  const { user: currentUser } = useContext(UserContext);

  // 📡 Join meeting when connected
  useEffect(() => {
    if (meetingID && isConnected) {
      joinMeeting(meetingID, currentUser, localStream);
    }

    return () => {
      leaveMeeting();
    };
  }, [meetingID, isConnected]);

  // 🎥 Attach local stream to video/audio elements
  // useEffect(() => {
  //   if (localStream) {
  //     if (videoRef.current) {
  //       videoRef.current.srcObject = localStream;
  //     }
  //     if (audioRef.current) {
  //       audioRef.current.srcObject = localStream;
  //     }
  //     updateTracksForAllPeers(localStream, "camera"); // 👉 this function you'll define in context
  //   }
  // }, [localStream]);

  // 🎥 Attach local stream to video/audio elements
  useEffect(() => {
    if (localStream?.camera) {
      if (videoRef.current) {
        videoRef.current.srcObject = localStream.camera;
      }
      if (audioRef.current) {
        audioRef.current.srcObject = localStream.camera;
      }

      updateTracksForAllPeers(localStream.camera, "camera");
    }
  }, [localStream?.camera]);

  // 🎬 Enable camera
  // const handleEnableCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     setLocalStream(stream);
  //   } catch (err) {
  //     console.error("❌ Camera/mic access denied:", err);
  //   }
  // };

  // // 🛑 Stop camera
  // const handleStopCamera = () => {
  //   if (localStream) {
  //     localStream.getTracks().forEach((track) => track.stop());
  //     setLocalStream(null);
  //   }
  // };

  // handles the camera
  const handleEnableCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      const newStream = new MediaStream();

      // ✅ Add existing audio tracks from previous camera/audio stream
      if (localStream?.camera?.getAudioTracks().length) {
        localStream.camera.getAudioTracks().forEach((track) => {
          newStream.addTrack(track);
        });
      }

      // ✅ Add video tracks from new video stream
      videoStream.getVideoTracks().forEach((track) => {
        newStream.addTrack(track);
      });

      // 📦 Update structured local stream state
      setLocalStream((prev) => ({
        ...prev,
        camera: newStream,
      }));

      // 🔁 Send update to peers
      updateTracksForAllPeers(newStream, "camera");

      setIsCameraOn(true);
    } catch (err) {
      console.error("❌ Camera access denied:", err);
    }
  };

  const handleStopCamera = () => {
    const currentCamStream = localStream?.camera;

    if (!currentCamStream) return;

    // 🚫 Stop all video tracks
    currentCamStream.getVideoTracks().forEach((track) => track.stop());

    // 🎯 Remove camera from state
    setLocalStream((prev) => ({
      ...prev,
      camera: null,
    }));

    // 🧹 Tell peers to remove camera tracks
    updateTracksForAllPeers(new MediaStream(), "camera");

    setIsCameraOn(false);
  };

  // handle the enable disble of mic

  const handleEnableMic = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      // Clone current camera stream (or create new)
      const cameraStream = localStream?.camera
        ? new MediaStream(localStream.camera.getVideoTracks())
        : new MediaStream();

      // Add mic track
      audioStream.getAudioTracks().forEach((track) => {
        cameraStream.addTrack(track);
      });

      // 🔁 Set combined camera + mic stream
      setLocalStream((prev) => ({
        ...prev,
        camera: cameraStream,
      }));

      // 🔁 Update tracks for all peers
      updateTracksForAllPeers(cameraStream, "camera");

      setIsMicOn(true);
    } catch (err) {
      console.error("❌ Mic access denied:", err);
    }
  };

  const handleMuteMic = () => {
    if (!localStream?.camera) return;

    // Stop all audio tracks in the camera stream
    localStream.camera.getAudioTracks().forEach((track) => track.stop());

    // Create new stream without audio
    const newStream = new MediaStream();
    localStream.camera.getVideoTracks().forEach((track) => {
      newStream.addTrack(track);
    });

    // Update state and peer tracks
    setLocalStream((prev) => ({
      ...prev,
      camera: newStream,
    }));

    updateTracksForAllPeers(newStream, "camera");

    setIsMicOn(false);
  };

  // handle screen share
  // const handleStartScreenShare = async () => {
  //   try {
  //     const screenStream = await navigator.mediaDevices.getDisplayMedia({
  //       video: true,
  //     });

  //     updateTracksForAllPeers(screenStream, "screen");

  //     // Optional: detect when screen share ends
  //     screenStream.getVideoTracks()[0].addEventListener("ended", () => {
  //       updateTracksForAllPeers(new MediaStream(), "screen"); // clean up
  //     });
  //     setIsScreenSharing(true);
  //   } catch (err) {
  //     setIsScreenSharing(false);
  //     console.error("❌ Screen share error:", err);
  //   }
  // };
  const handleStartScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // Update localStream state to include screen
      setLocalStream((prev) => ({
        ...prev,
        screen: screenStream,
      }));

      // Send screen track to peers
      await updateTracksForAllPeers(screenStream, "screen");

      // 🛑 When screen sharing stops, clean up
      screenStream.getVideoTracks()[0].addEventListener("ended", async () => {
        setLocalStream((prev) => ({
          ...prev,
          screen: null,
        }));

        await updateTracksForAllPeers(new MediaStream(), "screen"); // remove screen from peers
        setIsScreenSharing(false);
      });

      setIsScreenSharing(true);
    } catch (err) {
      setIsScreenSharing(false);
      console.error("❌ Screen share error:", err);
    }
  };

  // const handleStopScreenShare = () => {
  //   const screen = localStream?.screen;
  //   if (screen) {
  //     screen.getTracks().forEach((track) => track.stop());
  //     updateTracksForAllPeers(new MediaStream(), "screen"); // clean up
  //   }
  //   setIsScreenSharing(false);
  // };

  // 🧠 Merge remote streams with participants
  // const mergedParticipants = participantsList.map((p) => ({
  //   ...p,
  //   videoStream:
  //     p._id === currentUser?._id
  //       ? localStream
  //       : remoteStreams[p.socketId] || null,
  // }));

  const handleStopScreenShare = async () => {
    const screen = localStream?.screen;

    if (screen) {
      // 🛑 Stop all screen tracks
      screen.getTracks().forEach((track) => track.stop());

      // 🧹 Remove screen track from all peer connections
      await updateTracksForAllPeers(new MediaStream(), "screen");

      // 🧠 Update local state to reflect screen is no longer active
      setLocalStream((prev) => ({
        ...prev,
        screen: null,
      }));
    }

    setIsScreenSharing(false);
  };

  const mergedParticipants = participantsList.map((p) => ({
    ...p,
    videoStream:
      p._id === currentUser?._id
        ? {
            camera: localStream?.camera || null,
            screen: localStream?.screen || null,
          }
        : remoteStreams[p.socketId] || { camera: null, screen: null },
  }));

  return (
    <div className="join-meeting-container">
      <TopMeetingBar roomName={`Meeting: ${meetingID}`} />

      <div className="join-meeting-body">
        <div className="join-meeting-video-area">
          <VideoGrid
            currentUser={currentUser}
            participants={mergedParticipants}
            localStream={localStream}
            videoRef={videoRef}
          />
        </div>

        <ParticipantSidebar participants={mergedParticipants} />
      </div>

      <MeetingControls
        onStartCamera={handleEnableCamera}
        onStopCamera={handleStopCamera}
        onStartMic={handleEnableMic}
        onStopMic={handleMuteMic}
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        handleStartScreenShare={handleStartScreenShare}
        handleStopScreenShare={handleStopScreenShare}
        isScreenSharing={isScreenSharing}
      />

      <RemoteRequestPanel />

      <audio ref={audioRef} autoPlay style={{ display: "none" }} />
    </div>
  );
};

export default JoinMeeting;
