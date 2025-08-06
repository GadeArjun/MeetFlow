exports.meetingSocketHandling = (io) => {
  const rooms = {}; // { roomId: Set(socket.id) }
  const userMeta = {}; // { socket.id: { username, roomId } }
  const mediaStates = {}; // { socket.id: { isCameraon: true/false, isScreenSharing: true/false } }

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    socket.on("join-room", ({ roomId, username }) => {
      console.log(`User ${username} joined room ${roomId}`);
      userMeta[socket.id] = { username, roomId };
      socket.roomId = roomId;

      if (!rooms[roomId]) rooms[roomId] = new Set();
      rooms[roomId].add(socket.id);
      socket.join(roomId);

      // Send current media state of other users

      const otherUsers = Array.from(rooms[roomId]).filter(
        (id) => id !== socket.id
      );
      socket.emit("existing-users", { users: otherUsers });

      const currentMediaStates = {};

      otherUsers.forEach((id) => {
        if (mediaStates[id]) {
          currentMediaStates[id] = mediaStates[id];
        }
      });

      // Emit to the new user
      socket.emit("all-users-media-state", currentMediaStates);

      otherUsers.forEach((id) => {
        socket.to(id).emit("user-joined", { socketId: socket.id, username });
      });
    });

    socket.on("send-offer", ({ targetId, offer }) => {
      io.to(targetId).emit("receive-offer", { senderId: socket.id, offer });
    });

    socket.on("send-answer", ({ targetId, answer }) => {
      io.to(targetId).emit("receive-answer", { senderId: socket.id, answer });
    });

    socket.on("send-ice-candidate", ({ targetId, candidate }) => {
      io.to(targetId).emit("receive-ice-candidate", {
        senderId: socket.id,
        candidate,
      });
    });

    socket.on("initial-media-state", (state) => {
      mediaStates[state.socketId] = {
        isCameraOn: state.isCameraOn,
        isScreenSharing: state.isScreenSharing,
      };

      socket.to(socket.roomId).emit("user-media-state", state);
    });

    socket.on("camera-toggled", (data) => {
      if (!mediaStates[data.socketId]) mediaStates[data.socketId] = {};
      mediaStates[data.socketId].isCameraOn = data.isCameraOn;

      socket.to(socket.roomId).emit("user-camera-update", data);
    });

    socket.on("screen-toggled", (data) => {
      if (!mediaStates[data.socketId]) mediaStates[data.socketId] = {};
      mediaStates[data.socketId].isScreenSharing = data.isScreenSharing;
      socket.to(socket.roomId).emit("user-screen-update", data);
    });

    // handle explicit leave-room from clients
    socket.on("leave-room", ({ roomId, username }) => {
      try {
        // Defensive checks
        if (!roomId) {
          console.warn("leave-room: missing roomId from", socket.id);
          return;
        }

        // Remove from room set
        if (rooms[roomId]) {
          rooms[roomId].delete(socket.id);

          // If room empty, cleanup
          if (rooms[roomId].size === 0) {
            delete rooms[roomId];
          }
        }

        // Clean user meta & media state
        if (userMeta[socket.id]) delete userMeta[socket.id];
        if (mediaStates[socket.id]) delete mediaStates[socket.id];

        // Make the socket leave the room (optional but tidy)
        socket.leave(roomId);

        // Inform other users in the room that this user left
        socket.to(roomId).emit("user-left", { socketId: socket.id });

        // Optionally send updated media states of remaining users to everyone in the room
        // Build a map of remaining users' media states
        const remainingStates = {};
        if (rooms[roomId]) {
          for (const id of rooms[roomId]) {
            if (mediaStates[id]) remainingStates[id] = mediaStates[id];
          }
        }
        // Tell everyone in the room the updated map
        io.in(roomId).emit("all-users-media-state", remainingStates);

        console.log(
          `Socket ${socket.id} (${username || "unknown"}) left room ${roomId}`
        );
      } catch (err) {
        console.error("Error in leave-room handler:", err);
      }
    });

    socket.on("disconnect", () => {
      const meta = userMeta[socket.id];
      if (!meta) return;

      const { roomId } = meta;
      rooms[roomId]?.delete(socket.id);

      if (rooms[roomId]?.size === 0) delete rooms[roomId];

      delete userMeta[socket.id];
      delete mediaStates[socket.id]; // ✅ Clean up media state

      socket.to(roomId).emit("user-left", { socketId: socket.id });
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });
  });
};
