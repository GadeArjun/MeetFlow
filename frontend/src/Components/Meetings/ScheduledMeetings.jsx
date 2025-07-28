
// import React, { useContext, useEffect, useState } from "react"; // 🧠 Added useEffect and useState
// import "./ScheduledMeetings.css";
// import { Plus, Video } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import { MeetingContext } from "../../context/MeetingContext";

// const colors = ["pink", "green", "purple", "blue", "orange", "teal"];

// const ScheduledMeetings = () => {
//   const { meetings, meetingContextLoading,setMeetings } = useContext(MeetingContext);
//   const navigate = useNavigate();
//   const [remainingTimes, setRemainingTimes] = useState({}); // ⏱️ Track remaining times

//   const navigateToCreateNew = () => {
//     navigate("/create-meeting");
//   };

//   const handleJoin = (code) => {
//     navigate(`/join-meeting/${code}`);
//   };

//   // ⏳ Compute remaining time for each meeting
//   const getRemainingTime = (date, startTime) => {
//     const now = new Date();
//     const dateStr = new Date(date).toISOString().split("T")[0]; // format date as YYYY-MM-DD
//     const startDateTime = new Date(`${dateStr}T${startTime}:00`); // convert to full datetime

//     const diffMs = startDateTime - now;

//     if (diffMs <= 0) return "Now";

//     const diffMinutes = Math.floor(diffMs / 1000 / 60);
//     const hours = Math.floor(diffMinutes / 60);
//     const minutes = diffMinutes % 60;

//     if (hours > 0) return `${hours}h ${minutes}m`;
//     return `${minutes}m`;
//   };

//   // 🔁 Continuously update remaining times
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const updatedTimes = {};
//       meetings.forEach((meeting) => {
//         updatedTimes[meeting._id] = getRemainingTime(
//           meeting.date,
//           meeting.startTime
//         );
//       });
//       setRemainingTimes(updatedTimes);
//     }, 1000); // update every second

//     return () => clearInterval(interval); // cleanup on unmount
//   }, [meetings]);

//   return (
//     <div className="scheduled-meetings-card">
//       <div className="header-row">
//         <h3>Scheduled Meetings</h3>
//         <button onClick={navigateToCreateNew} className="create-new">
//           <Plus size={16} />
//           Create New
//         </button>
//       </div>

//       <div className="meetings-list">
//         {meetingContextLoading ? (
//           <p>Loading...</p>
//         ) : meetings.length === 0 ? (
//           <p>No meetings scheduled.</p>
//         ) : (
//           meetings.map((meeting, index) => {
//             const color = colors[index % colors.length];
//             const time = `${meeting.startTime} – ${meeting.endTime}`;
//             const date = new Date(meeting.date).toLocaleDateString();
//             const remaining =
//               remainingTimes[meeting._id] ||
//               getRemainingTime(meeting.date, meeting.startTime);

//             const getStatusClass = (status) => {
//               switch (status) {
//                 case "scheduled":
//                   return "status scheduled";
//                 case "ongoing":
//                   return "status ongoing";
//                 case "completed":
//                   return "status completed";
//                 case "cancelled":
//                   return "status cancelled";
//                 default:
//                   return "status";
//               }
//             };

//             return (
//               <div key={meeting._id} className={`meeting-card ${color}`}>
//                 <div className="meeting-info">
//                   <h4>{meeting.title}</h4>
//                   <p>
//                     {time} | {date}
//                   </p>
//                   <span className={getStatusClass(meeting.status)}>
//                     {meeting.status}
//                   </span>
//                   {meeting.status === "scheduled" && (
//                     <p className="remaining-time">Starts in: {remaining}</p>
//                   )}
//                 </div>
//                 <button
//                   className="join-link"
//                   onClick={() => handleJoin(meeting.meetingCode)}
//                   disabled={meeting.status === "cancelled"}
//                 >
//                   <Video size={16} style={{ marginRight: "6px" }} />
//                   Join
//                 </button>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default ScheduledMeetings;


import React, { useContext, useEffect, useState } from "react";
import "./ScheduledMeetings.css";
import { Plus, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MeetingContext } from "../../context/MeetingContext";

const colors = ["pink", "green", "purple", "blue", "orange", "teal"];

const ScheduledMeetings = () => {
  const { meetings, meetingContextLoading, setMeetings } =
    useContext(MeetingContext);
  const navigate = useNavigate();
  const [remainingTimes, setRemainingTimes] = useState({}); // For live countdown

  const navigateToCreateNew = () => {
    navigate("/create-meeting");
  };

  const handleJoin = (code) => {
    navigate(`/join-meeting/${code}`);
  };

  // Format remaining time
  const formatRemainingTime = (ms) => {
    if (ms <= 0) return "Starts now";

    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    let result = "";
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0 || result === "") result += `${seconds}s`;

    return result.trim();
  };

  // Live updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedTimes = {};
      const updatedMeetings = [...meetings];

      const filteredMeetings = updatedMeetings.filter((meeting) => {
        const dateStr = new Date(meeting.date).toISOString().split("T")[0];

        const startDateTime = new Date(`${dateStr}T${meeting.startTime}:00`);
        const endDateTime = new Date(`${dateStr}T${meeting.endTime}:00`);

        if (now >= endDateTime) {
          // Meeting expired
          return false;
        }

        if (
          now >= startDateTime &&
          now < endDateTime &&
          meeting.status !== "ongoing"
        ) {
          // Meeting should now be ongoing
          meeting.status = "ongoing";
        }

        if (meeting.status === "scheduled") {
          const remainingMs = startDateTime - now;
          updatedTimes[meeting._id] = formatRemainingTime(remainingMs);
        }

        return true;
      });

      setRemainingTimes(updatedTimes);
      setMeetings(filteredMeetings);
    }, 1000);

    return () => clearInterval(interval);
  }, [meetings, setMeetings]);

  return (
    <div className="scheduled-meetings-card">
      <div className="header-row">
        <h3>Scheduled Meetings</h3>
        <button onClick={navigateToCreateNew} className="create-new">
          <Plus size={16} />
          Create New
        </button>
      </div>

      <div className="meetings-list">
        {meetingContextLoading ? (
          <p>Loading...</p>
        ) : meetings.length === 0 ? (
          <p>No meetings scheduled.</p>
        ) : (
          meetings.map((meeting, index) => {
            const color = colors[index % colors.length];
            const time = `${meeting.startTime} – ${meeting.endTime}`;
            const date = new Date(meeting.date).toLocaleDateString();
            const remaining = remainingTimes[meeting._id];

            const getStatusClass = (status) => {
              switch (status) {
                case "scheduled":
                  return "status scheduled";
                case "ongoing":
                  return "status ongoing";
                case "completed":
                  return "status completed";
                case "cancelled":
                  return "status cancelled";
                default:
                  return "status";
              }
            };

            return (
              <div key={meeting._id} className={`meeting-card ${color}`}>
                <div className="meeting-info">
                  <h4>{meeting.title}</h4>
                  <p>
                    {time} | {date}
                  </p>
                  <span className={getStatusClass(meeting.status)}>
                    {meeting.status}
                  </span>
                  {meeting.status === "scheduled" && remaining && (
                    <p className="remaining-time">Starts in: {remaining}</p>
                  )}
                </div>
                <button
                  className="join-link"
                  onClick={() => handleJoin(meeting.meetingCode)}
                  disabled={meeting.status === "cancelled"}
                >
                  <Video size={16} style={{ marginRight: "6px" }} />
                  Join
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ScheduledMeetings;
