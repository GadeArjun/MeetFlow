// src/Components/JoinMeeting/VideoGrid.jsx
import React from "react";
import { Video, ScreenShare, MoreVertical, Expand, User } from "lucide-react";
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
 * - participants: { [socketId]: { _id: string, name: string } }
 */
const VideoGrid = ({
  currentUserId,
  registerLocalVideoRef,
  localScreenRef,
  remoteStreams = {},
  remoteMediaStates = {},
  localIsCameraOn = false,
  localIsScreenSharing = false,
  participants = {},
  registerLocalScreenRef,
}) => {
  const toggleFullscreen = (el) => {
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) =>
        console.error("Fullscreen error:", err)
      );
    } else {
      document.exitFullscreen();
    }
  };

  const backgroundColors = [
    "linear-gradient(135deg, #ff6a00, #ee0979)",
    "linear-gradient(135deg, #4e54c8, #8f94fb)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
    "linear-gradient(135deg, #fc466b, #3f5efb)",
    "linear-gradient(135deg, #f7971e, #ffd200)",
  ];

  return (
    <div className="video-grid">
      <div className="other-grid">
        {Object.entries(participants).map(([socketId, user], index) => {
          const isSelf = user._id === currentUserId;
          const streams = isSelf ? {} : remoteStreams[socketId] || {};

          const isCamOn = isSelf
            ? localIsCameraOn
            : remoteMediaStates[socketId]?.isCameraOn;
          const isScreenOn = isSelf
            ? localIsScreenSharing
            : remoteMediaStates[socketId]?.isScreenSharing;

          const isMicOn = remoteMediaStates[socketId]?.isMicOn;
          console.log({ isMicOn, a: remoteMediaStates[socketId] });

          const bothOff = !isCamOn && !isScreenOn;

          return (
            <div className="video-tile" key={socketId}>
              {/* Menu button */}
              <button className="tile-menu-btn" aria-label="menu">
                <MoreVertical size={16} />
              </button>

              {bothOff ? (
                // Special full-card UI when both camera and screen are off
                <div
                  className="both-off-card"
                  style={{
                    background: `${
                      backgroundColors[index % backgroundColors.length]
                    }`,
                  }}
                >
                  {/* <User size={48} color="white" /> */}
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-circle">
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
              ) : (
                <div className="dual-stream-container split">
                  {/* Camera Section */}
                  <div className="stream-section">
                    {isCamOn ? (
                      <>
                        <span
                          className="video-icon-on-start fullscreen-toggle"
                          onClick={() =>
                            toggleFullscreen(
                              document.getElementById(`cam-${socketId}`)
                            )
                          }
                          title="Toggle Fullscreen"
                        >
                          <Expand size={18} color="white" />
                        </span>

                        <video
                          id={`cam-${socketId}`}
                          autoPlay
                          playsInline
                          muted
                          ref={(el) => {
                            if (isSelf) {
                              registerLocalVideoRef(el);
                            } else if (el && el.srcObject !== streams.camera) {
                              el.srcObject = streams.camera || null;
                            }
                          }}
                          className="user-video"
                        />
                      </>
                    ) : (
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
                          onClick={() =>
                            toggleFullscreen(
                              document.getElementById(`screen-${socketId}`)
                            )
                          }
                          title="Toggle Fullscreen"
                        >
                          <Expand size={18} color="white" />
                        </span>

                        <video
                          id={`screen-${socketId}`}
                          autoPlay
                          playsInline
                          muted
                          ref={(el) => {
                            if (isSelf) {
                              // localScreenRef(el);
                              registerLocalScreenRef(el);
                            } else if (el && el.srcObject !== streams.screen) {
                              el.srcObject = streams.screen || null;
                            }
                          }}
                          className="user-video"
                        />
                      </>
                    ) : (
                      <div className="video-placeholder">
                        <ScreenShare size={28} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Participant name */}
              <div className="participant-name">
                {/* {isSelf ? "You" : user.name} */}
                <div className="user-info">
                  <div className="user-name">{isSelf ? "You" : user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>

              {/* audio section */}
              {!isSelf && isMicOn && (
                <audio
                  // style={{ display: "none" }}
                  autoPlay
                  playsInline
                  muted={!isMicOn}
                  ref={(el) => {
                    if (isSelf) {
                      return;
                    }
                    if (el && el.srcObject !== streams.audio) {
                      el.srcObject = streams.audio || null;
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoGrid;
