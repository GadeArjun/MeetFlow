import React, { useEffect } from "react";
import {
  Mic,
  Video,
  VideoOff,
  ScreenShare,
  Hand,
  MicOff,
  XSquare,
  Phone,
} from "lucide-react";
import "./MeetingControls.css";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 * - toggleCamera: () => void
 * - toggleMic: () => void
 * - isCameraOn: boolean
 * - isMicOn: boolean
 * - isScreenSharing: boolean
 * - toggleScreenSharing: () => void
 */

const MeetingControls = ({
  toggleCamera,
  toggleMic,
  isCameraOn,
  isMicOn,
  isScreenSharing,
  toggleScreenSharing,
  leaveMeeting,
}) => {
  const navigate = useNavigate();
  // 🔹 Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (e) => {
      // Ignore shortcuts if typing in input/textarea/contentEditable
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Lowercase key
      const key = e.key.toLowerCase();

      switch (key) {
        case "m": // M = toggle mic
          e.preventDefault();
          toggleMic();
          break;
        case "v": // V = toggle camera
          e.preventDefault();
          toggleCamera();
          break;
        case "s": // S = toggle screen share
          e.preventDefault();
          toggleScreenSharing();
          break;
        case "l": // L = leave meeting
          e.preventDefault();
          if (window.confirm("Leave meeting?")) {
            await leaveMeeting();
            navigate("/meetings");
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleMic, toggleCamera, toggleScreenSharing, leaveMeeting, navigate]);
  return (
    <div className="meeting-controls">
      <div className="controls-inner">
        {/* Mic */}
        <button
          className={`control-btn ${isMicOn ? "on" : "off"}`}
          onClick={toggleMic}
          aria-pressed={isMicOn}
          title={`Microphone (${isMicOn ? "On" : "Off"}) — shortcut: M`}
        >
          {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>

        {/* Camera - prominent */}
        <button
          className={`control-btn big ${isCameraOn ? "on" : "off"}`}
          onClick={toggleCamera}
          aria-pressed={isCameraOn}
          title={`Camera (${isCameraOn ? "On" : "Off"}) — shortcut: V`}
        >
          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        {/* Screen share */}
        <button
          className={`control-btn ${isScreenSharing ? "on" : "off"}`}
          onClick={toggleScreenSharing}
          aria-pressed={isScreenSharing}
          title={`Screen (${
            isScreenSharing ? "Sharing" : "Not sharing"
          }) — shortcut: S`}
        >
          {isScreenSharing ? <XSquare size={18} /> : <ScreenShare size={18} />}
        </button>

        {/* Raise hand */}
        {/* <button className="control-btn" title="Raise hand">
          <Hand size={18} />
        </button> */}

        {/* End call (optional) */}
        <button
          className="control-btn end"
          onClick={async () => {
            if (window.confirm("Leave meeting?")) {
              await leaveMeeting();
              navigate("/meetings");
            }
          }}
          title="Leave meeting"
        >
          <Phone size={18} />
        </button>
      </div>
    </div>
  );
};

export default MeetingControls;
