// src/Components/JoinMeeting/VideoGrid.jsx
import React, { useState } from "react";
import {
  Video,
  ScreenShare,
  MoreVertical,
  Expand,
  User,
  CrossIcon,
  Cross,
  LucideCross,
  ShowerHead,
  LucideFullscreen,
} from "lucide-react";
import "./VideoGrid.css";

/**
 * Props:
 * - currentUserId: string (your user._id)
 * - registerLocalVideoRef: ref callback for local camera <video>
 * - localScreenRef: ref callback for local screen <video>
 * - remoteStreams: { [socketId]: { camera?: MediaStream, screen?: MediaStream } }
 * - remoteMediaStates: { [socketId]: { isCameraOn?: boolean, isScreenSharing?: boolean } }
 * - localIsCameraOn: boolean (local camera state)
 * - localIsScreenSharing: boolean (local screen state)
 */
const VideoGrid = ({
  currentUserId,
  registerLocalVideoRef,
  localScreenRef,
  remoteStreams = {},
  remoteMediaStates = {},
  localIsCameraOn = false,
  localIsScreenSharing = false,
}) => {
  const remoteEntries = Object.entries(remoteStreams || {});
  const [isFullSelf, setisFullSelf] = useState(false);
  const toggleFullscreen = (el) => {
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => console.error("FS error:", err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      {/* Remote participants grid */}
      <div className="video-grid">
        <div className="other-grid">
          {remoteEntries.map(([socketId, streams]) => {
            // Skip self if present in remoteStreams
            if (socketId === currentUserId) return null;

            const isCamOn = !!remoteMediaStates[socketId]?.isCameraOn;
            const isScreenOn = !!remoteMediaStates[socketId]?.isScreenSharing;

            const bothOff = !isCamOn && !isScreenOn;

            return (
              <div className="video-tile" key={socketId}>
                <button className="tile-menu-btn" aria-label="menu">
                  <MoreVertical size={16} />
                </button>

                <div className="dual-stream-container split">
                  {/* Camera Section */}
                  <div className="stream-section">
                    {isCamOn ? (
                      <>
                        <span
                          className="video-icon-on-start fullscreen-toggle"
                          onClick={() => {
                            const el = document.getElementById(
                              `cam-${socketId}`
                            );
                            toggleFullscreen(el);
                          }}
                          title="Toggle Fullscreen"
                        >
                          <Expand size={18} color="white" />
                        </span>

                        <video
                          id={`cam-${socketId}`}
                          autoPlay
                          playsInline
                          ref={(el) => {
                            if (el && el.srcObject !== streams.camera) {
                              el.srcObject = streams.camera;
                            }
                          }}
                          className="user-video"
                        />
                      </>
                    ) : bothOff ? (
                      /* When both are off, show User icon centered in the first section */
                      <div className="video-placeholder single-user">
                        <User size={34} />
                      </div>
                    ) : (
                      /* Camera is off but screen might be on — show camera icon placeholder */
                      <div className="video-placeholder">
                        <Video size={28} />
                      </div>
                    )}
                  </div>

                  <div className="stream-divider" />

                  {/* Screen Section */}
                  <div className="stream-section">
                    {isScreenOn ? (
                      <>
                        <span
                          className="video-icon-on-start fullscreen-toggle"
                          onClick={() => {
                            const el = document.getElementById(
                              `screen-${socketId}`
                            );
                            toggleFullscreen(el);
                          }}
                          title="Toggle Fullscreen"
                        >
                          <Expand size={18} color="white" />
                        </span>

                        <video
                          id={`screen-${socketId}`}
                          autoPlay
                          playsInline
                          ref={(el) => {
                            if (el && el.srcObject !== streams.screen) {
                              el.srcObject = streams.screen;
                            }
                          }}
                          className="user-video"
                        />
                      </>
                    ) : bothOff ? (
                      /* keep empty placeholder to preserve layout when both off */
                      <div className="video-placeholder empty" />
                    ) : (
                      /* Screen is off but camera might be on — show screen icon placeholder */
                      <div className="video-placeholder">
                        <ScreenShare size={28} />
                      </div>
                    )}
                  </div>
                </div>

                {/* No name shown per request */}
              </div>
            );
          })}
        </div>
      </div>

      {/* Self popup (floating) */}
      <div
        className={`${isFullSelf ? "self-popup" : "self-pop-small"}`}
        role="dialog"
        aria-label="Your streams"
      >
        <div className="self-header">
          <User size={14} />
          <strong style={{ marginLeft: 8 }}>You</strong>
          {isFullSelf ? (
            <LucideCross
              onClick={() => {
                setisFullSelf(false);
              }}
              style={{
                marginLeft: 8,
                cursor: "pointer",
                color: "white",
                transform: "rotate(45deg)",
                position: "absolute",
                right: 0,
              }}
              size={18}
            />
          ) : (
            <LucideFullscreen
              className="self-fullscreen-toggle"
              onClick={() => {
                setisFullSelf(true);
              }}
              size={14}
              style={{
                marginLeft: 8,
                cursor: "pointer",
                color: "white",
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {/* Self camera box */}
          <div className="self-video-box">
            <span
              className="video-icon-on-start fullscreen-toggle"
              onClick={() => {
                const el = document.getElementById("self-camera");
                toggleFullscreen(el);
              }}
              title="Toggle Fullscreen"
            >
              <Expand size={16} color="white" />
            </span>
            <video
              id="self-camera"
              ref={registerLocalVideoRef}
              autoPlay
              muted
              playsInline
              className="user-video self"
            />

            {/* Overlay placeholder shown only when local camera is off */}
            {!localIsCameraOn && (
              <div className="no-stream-overlay camera-overlay">
                <Video size={28} />
              </div>
            )}
          </div>

          {/* Self screen box */}
          <div className="self-video-box">
            {isFullSelf && (
              <span
                className="video-icon-on-start fullscreen-toggle"
                onClick={() => {
                  const el = document.getElementById("self-screen");
                  toggleFullscreen(el);
                }}
                title="Toggle Fullscreen"
              >
                <Expand size={16} color="white" />
              </span>
            )}

            <video
              id="self-screen"
              ref={localScreenRef}
              autoPlay
              muted
              playsInline
              className="user-video self"
            />

            {/* Overlay placeholder shown only when local screen is off */}
            {!localIsScreenSharing && (
              <div className="no-stream-overlay screen-overlay">
                <ScreenShare size={28} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoGrid;
