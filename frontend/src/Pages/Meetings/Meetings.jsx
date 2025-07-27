import React from "react";
import JoinByID from "../../Components/Meetings/JoinByID";
import ScheduledMeetings from "../../Components/Meetings/ScheduledMeetings";
import "./Meetings.css";

export default function Meetings() {
  return (
    <div className="join-meeting-page">
      {/* Top Banner */}
      <div className="join-banner">
        <div className="text-content">
          <h1>Join an Existing Meeting</h1>
          <p>
            Enter Meeting ID and join directly or choose from scheduled
            meetings.
          </p>
        </div>
      </div>

      {/* Join Box + List */}
      <div className="meeting-content">
        <JoinByID />
        <ScheduledMeetings />
      </div>
    </div>
  );
}
