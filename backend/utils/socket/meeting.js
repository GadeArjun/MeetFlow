
exports.meetingSocketHandling = (io) => {
  // Stores meeting participants per meetingCode
  const meetings = {}; // { meetingCode: Map<socketId, user> }

  io.on("connection", (socket) => {
    console.info("🔌 New client connected:", socket.id);

    // 🔹 JOIN MEETING
    socket.on("join_meeting", ({ meetingCode, user }) => {
      socket.join(meetingCode);

      if (!meetings[meetingCode]) {
        meetings[meetingCode] = new Map();
      }

      // Save user info with socketId
      meetings[meetingCode].set(socket.id, { ...user });

      // 🔔 Notify others that a new user joined
      socket.to(meetingCode).emit("user_joined", {
        user,
        socketId: socket.id,
      });

    
      // 🔄 Send updated participant list with socketId to all users
      io.to(meetingCode).emit(
        "update_participants",
        Array.from(meetings[meetingCode]).map(([socketId, user]) => ({
          ...user,
          socketId,
        }))
      );
    });

    // 🔹 MANUAL LEAVE
    socket.on("leave_meeting", ({ meetingCode }) => {
      socket.leave(meetingCode);

      if (meetings[meetingCode]?.has(socket.id)) {
        const user = meetings[meetingCode].get(socket.id);
        meetings[meetingCode].delete(socket.id);

        // 🔔 Notify others
        socket.to(meetingCode).emit("user_left", {
          user,
          socketId: socket.id,
        });

        // 🔄 Update participant list with socketId
        io.to(meetingCode).emit(
          "update_participants",
          Array.from(meetings[meetingCode]).map(([socketId, user]) => ({
            ...user,
            socketId,
          }))
        );

        // 🧹 Optional cleanup
        if (meetings[meetingCode].size === 0) {
          delete meetings[meetingCode];
        }
      }
    });

    // 🔹 PRIVATE MESSAGING
    socket.on("private_message", ({ toSocketId, fromUser, message }) => {
      io.to(toSocketId).emit("private_message", {
        from: fromUser,
        message,
      });
    });

    // 🔸 WebRTC: Offer
    socket.on("webrtc_offer", ({ to, from, sdp }) => {
      io.to(to).emit("webrtc_offer", { from, sdp });
    });

    // 🔸 WebRTC: Answer
    socket.on("webrtc_answer", ({ to, from, sdp }) => {
      io.to(to).emit("webrtc_answer", { from, sdp });
    });

    // 🔸 WebRTC: ICE Candidate
    socket.on("ice_candidate", ({ to, from, candidate }) => {
      io.to(to).emit("ice_candidate", { from, candidate });
    });

    // 🔹 DISCONNECT
    socket.on("disconnect", () => {
      console.info("❌ Client disconnected:", socket.id);

      for (const [meetingCode, participants] of Object.entries(meetings)) {
        if (participants.has(socket.id)) {
          const user = participants.get(socket.id);
          participants.delete(socket.id);

          // 🔔 Notify others in room
          socket.to(meetingCode).emit("user_left", {
            user,
            socketId: socket.id,
          });

          // 🔄 Update participant list
          io.to(meetingCode).emit(
            "update_participants",
            Array.from(participants).map(([socketId, user]) => ({
              ...user,
              socketId,
            }))
          );

          // 🧹 Clean up empty room
          if (participants.size === 0) {
            delete meetings[meetingCode];
          }

          break;
        }
      }
    });
  });
};
