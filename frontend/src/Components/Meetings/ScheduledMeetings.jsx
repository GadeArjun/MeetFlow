import React from "react";
import "./ScheduledMeetings.css";
import { Plus, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const meetings = [
  {
    title: "Design Sync with Team A",
    time: "11:30 AM – 12:00 PM",
    color: "pink",
  },
  {
    title: "Marketing Strategy Call",
    time: "1:00 PM – 01:30 PM",
    color: "green",
  },
  {
    title: "Deskly Dev Planning",
    time: "3:00 PM – 4:00 PM",
    color: "purple",
  },
];

const ScheduledMeetings = () => {
  const navigate = useNavigate();

  function navigateToCreateNew() {
    navigate("/create-meeting");
  }

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
        {meetings.map((meeting, index) => (
          <div key={index} className={`meeting-card ${meeting.color}`}>
            <div className="meeting-info">
              <h4>{meeting.title}</h4>
              <p>{meeting.time}</p>
            </div>
            <button className="join-link">
              <Video size={16} style={{ marginRight: "6px" }} />
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledMeetings;
