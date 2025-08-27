import React, { useState } from "react";
import "./JoinByID.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * A component for joining a meeting by a specific ID.
 * This version has been simplified to remove the password option.
 */
const JoinByID = () => {
  const [meetingID, setMeetingID] = useState("");
  const navigate = useNavigate();

  // Handle the action when the "Join Meeting" button is clicked.
  const handleJoin = async () => {
    // Basic validation to ensure a meeting ID is entered.
    if (meetingID.trim() === "") {
      // You could display an error message here instead of an alert.
      console.log("Please enter a valid Meeting ID.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/meeting/${meetingID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status !== 200) {
        alert(
          `Meeting with id "${meetingID}" not found. Create a new meeting.`
        );
        navigate("/create-meeting");
        return;
      }
    } catch (error) {
      console.log({ error });
      alert(`Meeting with id "${meetingID}" not found. Create a new meeting.`);
      navigate("/create-meeting");
      return;
    }
    console.log(`Navigating to meeting with ID: ${meetingID}`);
    // Navigates the user to the meeting URL.
    navigate(`/join-meeting/${meetingID}`);
  };

  return (
    <div className="join-by-id-card">
      <h3 className="card-title">Join a Meeting</h3>
      <input
        type="text"
        className="meeting-input"
        placeholder="Enter Meeting ID"
        value={meetingID}
        onChange={(e) => setMeetingID(e.target.value)}
      />

      <button className="join-button" onClick={handleJoin}>
        Join Meeting
      </button>
    </div>
  );
};

export default JoinByID;
