import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { socketConnection } from "../../utils/SocketConnection";

export const MeetingSocketContext = createContext();

export const MeetingSocketProvider = ({ children }) => {
  const [participantsList, setParticipantsList] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const pendingCandidatesRef = useRef({}); // socketId => [candidates]

  const socketRef = useRef(null);
  const peersRef = useRef({}); // socketId => RTCPeerConnection
  const meetingCodeRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    socketRef.current = socketConnection();

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      setIsConnected(false);
      setParticipantsList([]);
      peersRef.current = {};
      setRemoteStreams({});
    });

    // 🧠 Updated list of participants
    // socketRef.current.on("update_participants", (list) => {
    //   setParticipantsList(list);
    // });
    socketRef.current.on("update_participants", (list) => {
      // Attach the correct MediaStream to each user using their socketId
      const updated = list.map((user) => ({
        ...user,
        videoStream: remoteStreams[user.socketId] || null,
      }));
      setParticipantsList(updated);
    });

    // 🔔 A new user joined the meeting
    socketRef.current.on("user_joined", async ({ user, socketId }) => {
      console.log("🟢 New participant:", user);

      // Create WebRTC peer connection and send offer
      await createPeerConnection(socketId, true);
    });

    // 📩 Receive WebRTC offer
    // 📩 Receive WebRTC offer
    socketRef.current.on("webrtc_offer", async ({ from, sdp }) => {
      let pc = peersRef.current[from];

      if (!pc) {
        // 🔁 Create connection if not exists
        await createPeerConnection(from, false, sdp);
        return;
      }

      try {
        // 🧠 Apply remote offer
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));

        // 🧊 Add any buffered ICE candidates
        if (pendingCandidatesRef.current[from]) {
          for (const candidate of pendingCandidatesRef.current[from]) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.error("❌ Error adding buffered ICE candidate:", err);
            }
          }
          delete pendingCandidatesRef.current[from];
        }

        // 🧾 Create & send answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketRef.current.emit("webrtc_answer", {
          to: from,
          from: socketRef.current.id,
          sdp: answer,
        });
      } catch (err) {
        console.error("❌ Error handling offer from", from, err);
      }
    });

    // 📩 Receive WebRTC answer
    socketRef.current.on("webrtc_answer", async ({ from, sdp }) => {
      try {
        const pc = peersRef.current[from];
        if (!pc) {
          console.warn("⚠️ PeerConnection not found for:", from);
          return;
        }

        if (pc.signalingState === "stable") {
          console.warn("⚠️ Skipping answer: connection is already stable.");
          return;
        }

        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("✅ Remote description set from answer for:", from);
      } catch (err) {
        console.error("❌ Failed to set remote description from answer:", err);
      }
    });

    // 📩 ICE candidate received
    socketRef.current.on("ice_candidate", async ({ from, candidate }) => {
      const pc = peersRef.current[from];
      if (pc) {
        if (pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("❌ Failed to add ICE candidate:", err);
          }
        } else {
          // 🕓 Buffer it until remoteDescription is set
          if (!pendingCandidatesRef.current[from]) {
            pendingCandidatesRef.current[from] = [];
          }
          pendingCandidatesRef.current[from].push(candidate);
        }
      } else {
        console.warn("⚠️ ICE candidate received for unknown peer:", from);
      }
    });

    // 🔔 A user left the meeting
    socketRef.current.on("user_left", ({ user, socketId }) => {
      console.log("🚪 User left:", user.name || user._id);
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
      }

      setRemoteStreams((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // 🔗 Join meeting and store local stream
  const joinMeeting = async (meetingCode, user, localStream) => {
    meetingCodeRef.current = meetingCode;
    localStreamRef.current = localStream;
    socketRef.current.emit("join_meeting", { meetingCode, user });
  };

  // 🔚 Leave meeting
  const leaveMeeting = () => {
    const meetingCode = meetingCodeRef.current;

    if (meetingCode) {
      socketRef.current.emit("leave_meeting", { meetingCode });
      meetingCodeRef.current = null;
    }

    // Close peer connections
    Object.values(peersRef.current).forEach((pc) => pc.close());
    peersRef.current = {};
    setRemoteStreams({});
  };

  // 💬 Optional: Private message
  const sendPrivateMessage = (toSocketId, fromUser, message) => {
    socketRef.current.emit("private_message", {
      toSocketId,
      fromUser,
      message,
    });
  };

  // 🎥 Create RTCPeerConnection
  const createPeerConnection = async (
    socketId,
    isInitiator,
    remoteOffer = null
  ) => {
    if (peersRef.current[socketId]) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peersRef.current[socketId] = pc;

    // 📦 Add local tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // 📩 Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice_candidate", {
          to: socketId,
          from: socketRef.current.id,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("🎯 ontrack triggered from", socketId);

      const track = event.track;
      const kind = track.kind; // 'audio' or 'video'
      const stream = event.streams[0]; // media stream from peer

      // Decide type (camera or screen) — optional enhancement
      const isScreenTrack = stream
        .getVideoTracks()
        .some((t) => t.label.toLowerCase().includes("screen"));

      const streamType =
        kind === "video" ? (isScreenTrack ? "screen" : "camera") : kind;

      setRemoteStreams((prev) => ({
        ...prev,
        [socketId]: {
          ...(prev[socketId] || {}),
          [streamType]: stream,
        },
      }));

      // Track cleanup
      track.onmute = () => {
        console.log("🔇 Track muted:", kind);
        removeStreamType(socketId, streamType);
      };

      track.onended = () => {
        console.log("🔴 Track ended:", kind);
        removeStreamType(socketId, streamType);
      };
    };

    const removeStreamType = (socketId, type) => {
      setRemoteStreams((prev) => {
        const updated = { ...prev };
        if (updated[socketId]) {
          delete updated[socketId][type];

          // 🧼 Clean up empty object
          if (Object.keys(updated[socketId]).length === 0) {
            delete updated[socketId];
          }
        }
        return updated;
      });
    };

    // Initiate offer/answer
    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socketRef.current.emit("webrtc_offer", {
        to: socketId,
        from: socketRef.current.id,
        sdp: offer,
      });
    } else if (remoteOffer) {
      await pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketRef.current.emit("webrtc_answer", {
        to: socketId,
        from: socketRef.current.id,
        sdp: answer,
      });
    }
  };

  const updateTracksForAllPeers = async (stream, type = "camera") => {
    if (!localStreamRef.current) {
      localStreamRef.current = {};
    }

    localStreamRef.current[type] = stream;

    for (const [socketId, pc] of Object.entries(peersRef.current)) {
      // Replace or add only relevant track (e.g., video for camera/screen)
      stream.getTracks().forEach((newTrack) => {
        const existingSender = pc
          .getSenders()
          .find((sender) => sender.track?.kind === newTrack.kind);

        if (existingSender) {
          existingSender.replaceTrack(newTrack);
        } else {
          pc.addTrack(newTrack, stream);
        }
      });

      // 🔁 Renegotiate after updating tracks
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socketRef.current.emit("webrtc_offer", {
        to: socketId,
        from: socketRef.current.id,
        sdp: offer,
      });
    }
  };

  return (
    <MeetingSocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        participantsList,
        remoteStreams,
        joinMeeting,
        leaveMeeting,
        sendPrivateMessage,
        updateTracksForAllPeers,
      }}
    >
      {children}
    </MeetingSocketContext.Provider>
  );
};

// 🔁 Easy custom hook
export const useMeetingSocket = () => useContext(MeetingSocketContext);
