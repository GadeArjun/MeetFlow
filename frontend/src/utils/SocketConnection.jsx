// socketConnection.js
import { io } from "socket.io-client";

export const socketConnection = () => {
  return io(`${import.meta.env.VITE_BACKEND_URL}/`);
};
