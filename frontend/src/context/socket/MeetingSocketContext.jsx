// src/context/socket/MeetingSocketContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import { socketConnection } from "../../utils/SocketConnection";

const socket = socketConnection();

const MeetingSocketContext = createContext();

export const MeetingSocketProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState({}); // { socketId: { camera, screen } }

  const localVideoRef = useRef();
  const localScreenRef = useRef();
  const initialStream = useRef();
  const pcRef = useRef({});
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteMediaStates, setRemoteMediaStates] = useState({});
  const remoteMediaStatesRef = useRef({});
  // --- Socket Events ---
  useEffect(() => {
    socket.on("existing-users", async ({ users }) => {
      for (const userId of users) {
        await createPeer(userId, true);
      }
    });

    socket.on("user-joined", async ({ socketId }) => {
      await createPeer(socketId, false);
    });

    socket.on("receive-offer", async ({ senderId, offer }) => {
      const pc = await createPeer(senderId, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("send-answer", { targetId: senderId, answer });
    });

    socket.on("receive-answer", async ({ senderId, answer }) => {
      await pcRef.current[senderId]?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("receive-ice-candidate", async ({ senderId, candidate }) => {
      await pcRef.current[senderId]?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    socket.on("user-left", ({ socketId }) => {
      if (pcRef.current[socketId]) {
        pcRef.current[socketId].close();
        delete pcRef.current[socketId];
      }
      setRemoteStreams((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });

      setRemoteMediaStates((prev) => {
        const clone = { ...prev };
        delete clone[socketId];
        return clone;
      });
    });

    // initial states from existing users
    socket.on(
      "user-media-state",
      ({ socketId, isCameraOn, isScreenSharing }) => {
        setRemoteMediaStates((prev) => {
          const updated = {
            ...prev,
            [socketId]: { isCameraOn, isScreenSharing },
          };
          remoteMediaStatesRef.current = updated;
          return updated;
        });
      }
    );

    socket.on("user-camera-update", ({ socketId, isCameraOn }) => {
      setRemoteMediaStates((prev) => {
        const updated = {
          ...prev,
          [socketId]: {
            ...prev[socketId],
            isCameraOn,
          },
        };

        remoteMediaStatesRef.current = updated;
        return updated;
      });
    });

    socket.on("user-screen-update", ({ socketId, isScreenSharing }) => {
      setRemoteMediaStates((prev) => {
        const updated = {
          ...prev,
          [socketId]: {
            ...prev[socketId],
            isScreenSharing,
          },
        };

        remoteMediaStatesRef.current = updated;
        return updated;
      });
    });

    socket.on("all-users-media-state", (states) => {
      setRemoteMediaStates(states); // Directly set the map
      remoteMediaStatesRef.current = states; // Update the reference
    });
  }, []);

  const registerLocalVideoRef = (el) => {
    localVideoRef.current = el;
    if (el) {
      // attach existing stream if any
      if (localStreamRef.current) {
        el.srcObject = localStreamRef.current;
      }
      // optional: ensure muted/playsInline handled by DOM element props
    }
  };

  const joinRoom = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: isCameraOn,
      audio: isMicOn,
    });

    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    socket.emit("join-room", { roomId, username });

    socket.emit("initial-media-state", {
      socketId: socket.id,
      isCameraOn,
      isScreenSharing,
    });

    setJoined(true);
    toggleCamera();
    toggleMic();
  };

  // --- Create Peer ---
  const createPeer = async (socketId, initiator) => {
    if (pcRef.current[socketId]) return pcRef.current[socketId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Send local tracks

    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, screenStreamRef.current);
      });
    }

    pc.ontrack = async ({ track, streams: [stream] }) => {
      // const remoteState = await waitForRemoteMediaState(socketId);
      const remoteState = remoteMediaStatesRef.current[socketId];
      if (!remoteState) {
        console.warn("Remote media state not found for socketId:", socketId);
        return;
      }
      const isScreen = remoteState?.isScreenSharing;
      const isCamera = remoteState?.isCameraOn;
      console.log({ isCamera, isScreen });

      setRemoteStreams((prev) => {
        const existing = prev[socketId] || { camera: null, screen: null };
        const updated = { ...existing };

        if (isScreen) {
          updated.screen = updated.screen?.active ? updated.screen : stream;
          console.log("screen", updated.screen, stream);
        } else {
          updated.screen = null;
        }

        if (isCamera) {
          updated.camera = updated.camera?.active ? updated.camera : stream;
        } else {
          updated.camera = null;
        }

        return {
          ...prev,
          [socketId]: updated,
        };
      });
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("send-ice-candidate", {
          targetId: socketId,
          candidate: e.candidate,
        });
      }
    };

    pc.onnegotiationneeded = async () => {
      if (initiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("send-offer", { targetId: socketId, offer });
      }
    };

    pcRef.current[socketId] = pc;
    return pc;
  };

  const renegotiate = async (peer, socketId) => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("send-offer", { targetId: socketId, offer });
  };

  // --- Toggle Camera ---
  const toggleCamera = async () => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];

    if (isCameraOn && videoTrack) {
      videoTrack.stop();
      localStreamRef.current.removeTrack(videoTrack);
      Object.entries(pcRef.current).forEach(([socketId, peer]) => {
        const sender = peer
          .getSenders()
          .find(
            (s) =>
              s.track?.kind === "video" &&
              !s.track.label.toLowerCase().includes("screen")
          );
        if (sender) peer.removeTrack(sender);
        renegotiate(peer, socketId);
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const newTrack = newStream.getVideoTracks()[0];
      // newTrack.contentHint = "motion";
      localStreamRef.current.addTrack(newTrack);

      Object.entries(pcRef.current).forEach(([socketId, peer]) => {
        const sender = peer
          .getSenders()
          .find(
            (s) =>
              s.track?.kind === "video" &&
              !s.track.label.toLowerCase().includes("screen")
          );
        if (sender) sender.replaceTrack(newTrack);
        else peer.addTrack(newTrack, localStreamRef.current);
        renegotiate(peer, socketId);
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsCameraOn(true);
    }

    // inside toggleCamera after turning camera on/off:
    socket.emit("camera-toggled", {
      socketId: socket.id,
      isCameraOn: !isCameraOn,
    });
  };

  // --- Toggle Mic ---
  const toggleMic = () => {
    console.log("toggleMic");
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  // --- Toggle Screen Share ---
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach((track) => {
        Object.entries(pcRef.current).forEach(([socketId, peer]) => {
          const sender = peer.getSenders().find((s) => s.track === track);
          if (sender) peer.removeTrack(sender);
          renegotiate(peer, socketId);
        });
        track.stop();
      });

      screenStreamRef.current = null;
      if (localScreenRef.current) localScreenRef.current.srcObject = null;
      setIsScreenSharing(false);
    } else {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = screenStream;
      // screenStream.getVideoTracks()[0].contentHint = "detail";

      screenStream.getTracks().forEach((track) => {
        Object.entries(pcRef.current).forEach(([socketId, peer]) => {
          peer.addTrack(track, screenStream);
        });
      });

      localScreenRef.current.srcObject = screenStream;
      setIsScreenSharing(true);

      screenStream.getVideoTracks()[0].onended = () => {
        toggleScreenShare();
      };

      Object.entries(pcRef.current).forEach(([socketId, peer]) =>
        renegotiate(peer, socketId)
      );
    }

    // inside toggleScreenShare after share start/stop:
    socket.emit("screen-toggled", {
      socketId: socket.id,
      isScreenSharing: !isScreenSharing,
    });
  };

  const leaveMeeting = async () => {
    try {
      // 1️⃣ Stop local camera/mic tracks
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;

      // 2️⃣ Stop screen share tracks
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;

      // 3️⃣ Close all peer connections
      Object.values(pcRef.current).forEach((pc) => pc.close());
      pcRef.current = {};

      // 4️⃣ Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (localScreenRef.current) {
        localScreenRef.current.srcObject = null;
      }

      // 5️⃣ Reset state
      setRemoteStreams({});
      setRemoteMediaStates({});
      setIsCameraOn(false);
      setIsMicOn(false);
      setIsScreenSharing(false);
      setJoined(false);

      // 6️⃣ Tell server we left
      socket.emit("leave-room", { roomId, username });
      await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: false,
      });
    } catch (err) {
      console.error("Error leaving meeting:", err);
    }
  };

  return (
    <MeetingSocketContext.Provider
      value={{
        setRoomId,
        setUsername,
        joinRoom,
        localVideoRef,
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
        registerLocalVideoRef,
        leaveMeeting,
      }}
    >
      {children}
    </MeetingSocketContext.Provider>
  );
};

export const useMeeting = () => useContext(MeetingSocketContext);
