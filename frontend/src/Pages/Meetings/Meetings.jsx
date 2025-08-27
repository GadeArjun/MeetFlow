import React from "react";
import JoinByID from "../../Components/Meetings/JoinByID";
import ScheduledMeetings from "../../Components/Meetings/ScheduledMeetings";
import "./Meetings.css";
import Meta from "../../Components/Meta/Meta";

export default function Meetings() {
  return (
    <>
      <Meta page={"meetings"} />
      <div className="meetings-page">
        {/* Updated Banner */}
        <div className="meetings-banner">
          <div className="text-content">
            <h1 className="banner-title">Start or Join a Meeting</h1>
            <p className="banner-subtitle">
              Connect with your team instantly or access your scheduled
              sessions.
            </p>
          </div>
        </div>

        {/* Join Box + List */}
        <div className="meetings-content">
          <JoinByID />
          <ScheduledMeetings />
        </div>
      </div>
    </>
  );
}
