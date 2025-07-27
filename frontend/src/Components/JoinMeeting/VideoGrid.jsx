// // 📁 src/components/Meeting/VideoGrid.jsx
// import React from "react";
// import { User } from "lucide-react";
// import "./VideoGrid.css";

// const VideoGrid = ({ participants, localStream, videoRef }) => {
//   return (
//     <div className="video-grid">
//       {/* Current User's Live Video */}
//       {localStream ? (
//         <div className="video-tile">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted
//             className="user-video"
//           />
//           <span className="username">You</span>
//         </div>
//       ) : (
//         <div className="video-tile">
//           <div className="video-placeholder">
//             <User size={32} />
//           </div>
//           <span className="username">You</span>
//         </div>
//       )}

//       {/* Participants */}
//       {participants.map((user) => (
//         <div className="video-tile" key={user.id}>
//           {user.videoStream ? (
//             <video
//               autoPlay
//               playsInline
//               muted
//               className="user-video"
//               ref={(el) => {
//                 if (el) el.srcObject = user.videoStream;
//               }}
//             />
//           ) : user.image ? (
//             <img
//               src={user.image}
//               alt={user.name}
//               className="user-video"
//               onError={(e) => {
//                 e.target.style.display = "none";
//                 const fallback = e.target.nextElementSibling;
//                 if (fallback) fallback.style.display = "flex";
//               }}
//             />
//           ) : null}

//           {/* Fallback icon if no video or image */}
//           <div className="video-placeholder fallback">
//             <User size={32} />
//           </div>

//           <span className="username">{user.name}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default VideoGrid;

// 📁 src/components/Meeting/VideoGrid.jsx
import React from "react";
import { User, MoreVertical } from "lucide-react";
import "./VideoGrid.css";

const VideoGrid = ({ participants, localStream, videoRef }) => {
  return (
    <div className="video-grid">
      {/* Current User's Tile */}
      <div className="video-tile">
        {/* Action Menu (3 dots) */}
        <button className="tile-menu-btn">
          <MoreVertical size={18} />
        </button>

        {localStream ? (
          <video
            id="me"
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="user-video"
          />
        ) : (
          <div className="video-placeholder">
            <User size={36} />
          </div>
        )}
        <span className="username">You</span>
      </div>

      {/* Other Participants */}
      {participants.map((user) => (
        <div className="video-tile" key={user.id}>
          <button className="tile-menu-btn">
            <MoreVertical size={18} />
          </button>

          {user.videoStream ? (
            <video
              autoPlay
              playsInline
              muted
              className="user-video"
              ref={(el) => {
                if (el) el.srcObject = user.videoStream;
              }}
            />
          ) : user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="user-video"
              onError={(e) => {
                e.target.style.display = "none";
                const fallback = e.target.nextElementSibling;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : (
            <div className="video-placeholder">
              <User size={36} />
            </div>
          )}

          {/* Always render fallback icon (default hidden) */}
          <div className="video-placeholder fallback">
            <User size={36} />
          </div>

          <span className="username">{user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
