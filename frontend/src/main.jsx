import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext.jsx";
import { MeetingContextProvider } from "./context/MeetingContext.jsx";
import { MeetingSocketProvider } from "./context/socket/MeetingSocketContext.jsx";
import { HelmetProvider } from "react-helmet-async";
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <UserContextProvider>
    <MeetingContextProvider>
      <MeetingSocketProvider>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </MeetingSocketProvider>
    </MeetingContextProvider>
  </UserContextProvider>
  // </StrictMode>
);
