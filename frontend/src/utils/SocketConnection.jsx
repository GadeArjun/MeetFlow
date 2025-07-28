// socketConnection.js
import { io } from "socket.io-client";

export const socketConnection = () => {
  return io(
    "https://8080-firebase-deskly-1753548820703.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev",
    {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    }
  );
};
