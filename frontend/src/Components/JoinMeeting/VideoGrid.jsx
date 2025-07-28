// import React from "react";
// import { User, Video, ScreenShare, MoreVertical } from "lucide-react";
// import "./VideoGrid.css";

// const VideoGrid = ({ participants, currentUser, localStream, videoRef }) => {
//   return (
//     <div className="video-grid">
//       {participants.map((user) => {
//         const isCurrentUser = user._id === currentUser?._id;
//         const streamObj =
//           user._id === currentUser._id ? localStream : user.videoStream || {};
//         const hasCamera = streamObj?.camera
//           ?.getVideoTracks()
//           ?.some((t) => t.readyState === "live");
//         const hasScreen = streamObj?.screen
//           ?.getVideoTracks()
//           ?.some((t) => t.readyState === "live");

//         return (
//           <div className="video-tile" key={user._id}>
//             <button className="tile-menu-btn">
//               <MoreVertical size={18} />
//             </button>

//             <div
//               className={`dual-stream-container ${
//                 hasCamera && hasScreen ? "split" : ""
//               }`}
//             >
//               {/* Camera */}
//               <div className="stream-section">
//                 {hasCamera ? (
//                   <video
//                     autoPlay
//                     playsInline
//                     muted={isCurrentUser}
//                     ref={(el) => {
//                       if (el) el.srcObject = streamObj.camera;
//                       if (isCurrentUser && videoRef) videoRef.current = el;
//                     }}
//                     className="user-video"
//                   />
//                 ) : (
//                   <div className="video-placeholder">
//                     <Video size={28} />
//                   </div>
//                 )}
//               </div>

//               {/* Screen */}
//               <div className="stream-section">
//                 {hasScreen ? (
//                   <video
//                     autoPlay
//                     playsInline
//                     muted={isCurrentUser}
//                     ref={(el) => {
//                       if (el) el.srcObject = streamObj.screen;
//                     }}
//                     className="user-video"
//                   />
//                 ) : (
//                   <div className="video-placeholder">
//                     <ScreenShare size={28} />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <span className="username">
//               {isCurrentUser ? "You" : user.name}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default VideoGrid;

import React from "react";
import { User, Video, ScreenShare, MoreVertical, Expand } from "lucide-react";
import "./VideoGrid.css";

const VideoGrid = ({ participants, currentUser, localStream, videoRef }) => {
  return (
    <div className="video-grid">
      {participants.map((user) => {
        const isCurrentUser = user._id === currentUser?._id;
        const streamObj =
          user._id === currentUser._id ? localStream : user.videoStream || {};
        const hasCamera = streamObj?.camera
          ?.getVideoTracks()
          ?.some((t) => t.readyState === "live");
        const hasScreen = streamObj?.screen
          ?.getVideoTracks()
          ?.some((t) => t.readyState === "live");

        return (
          <div className="video-tile" key={user._id}>
            <button className="tile-menu-btn">
              <MoreVertical size={18} />
            </button>

            <div className={`dual-stream-container ${"split"}`}>
              {/* Camera */}
              <div className="stream-section">
                {hasCamera ? (
                  <div>
                    <span
                      className="video-icon-on-start fullscreen-toggle"
                      onClick={() => {
                        if (videoRef?.current) {
                          if (!document.fullscreenElement) {
                            videoRef.current.requestFullscreen();
                          } else {
                            document.exitFullscreen();
                          }
                        }
                      }}
                      title="Toggle Fullscreen"
                    >
                      <Expand size={20} color="white" />
                    </span>
                    <video
                      autoPlay
                      playsInline
                      muted={isCurrentUser}
                      ref={(el) => {
                        if (el) el.srcObject = streamObj.camera;
                        if (isCurrentUser && videoRef) videoRef.current = el;
                      }}
                      className="user-video"
                    />
                  </div>
                ) : (
                  <div className="video-placeholder">
                    <Video size={28} />
                  </div>
                )}
              </div>

              {/* Divider */}
              {<div className="stream-divider" />}

              {/* Screen */}
              <div className="stream-section">
                {hasScreen ? (
                  <div>
                    <span
                      className="video-icon-on-start fullscreen-toggle"
                      onClick={() => {
                        const videoEl = document.getElementById(
                          `screen-${user._id}`
                        );
                        if (videoEl) {
                          if (!document.fullscreenElement) {
                            videoEl
                              .requestFullscreen()
                              .catch((err) =>
                                console.error("Fullscreen error:", err)
                              );
                          } else {
                            document.exitFullscreen();
                          }
                        }
                      }}
                      title="Toggle Fullscreen"
                    >
                      <Expand size={20} color="white" />
                    </span>

                    <video
                      id={`screen-${user._id}`} // 🔐 give a unique ID per user
                      autoPlay
                      playsInline
                      muted={isCurrentUser}
                      ref={(el) => {
                        if (el) el.srcObject = streamObj.screen;
                      }}
                      className="user-video"
                    />
                  </div>
                ) : (
                  <div className="video-placeholder">
                    <ScreenShare size={28} />
                  </div>
                )}
              </div>
            </div>

            <span className="username">
              {isCurrentUser ? "You" : user.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default VideoGrid;
