// 📁 src/components/Meeting/MeetingControls.jsx
import React from "react";
import { Mic, Video, VideoOff, ScreenShare, Hand, MicOff, XSquare } from "lucide-react";
import "./MeetingControls.css";

// const MeetingControls = ({ onStartCamera, onStopCamera, isCameraOn }) => {
//   return (
//     <div className="join-meeting-controls">
//       <button onClick={isCameraOn ? onStopCamera : onStartCamera}>
//         {isCameraOn ? <VideoOff /> : <Video />} Camera
//       </button>
//       <button>
//         <Mic /> Mute
//       </button>
//       <button>
//         <ScreenShare /> Share
//       </button>
//       <button>
//         <Hand /> Raise Hand
//       </button>
//       <button className="leave-btn">Leave</button>
//     </div>
//   );
// };

const MeetingControls = ({
  onStartCamera,
  onStopCamera,
  onStartMic,
  onStopMic,
  isCameraOn,
  isMicOn,
  isScreenSharing,
  handleStartScreenShare,
  handleStopScreenShare,
}) => {
  return (
    <div className="join-meeting-controls">
      <button onClick={isCameraOn ? onStopCamera : onStartCamera}>
        {isCameraOn ? <VideoOff /> : <Video />} Camera
      </button>
      <button onClick={isMicOn ? onStopMic : onStartMic}>
        {isMicOn ? <MicOff /> : <Mic />}
        {isMicOn ? "Mute" : "Unmute"}
      </button>
      <button
        onClick={
          isScreenSharing ? handleStopScreenShare : handleStartScreenShare
        }
      >
        {isScreenSharing ? <XSquare /> : <ScreenShare />} Share Screen
      </button>
      <button>
        <Hand /> Raise Hand
      </button>
      {/* <button className="leave-btn">Leave</button> */}
    </div>
  );
};
export default MeetingControls;
