import React, { useState } from "react";
import "./JoinByID.css";

const JoinByID = () => {
  const [meetingID, setMeetingID] = useState("");
  const [password, setPassword] = useState("");
  const [isSecure, setIsSecure] = useState(false);

  const handleJoin = () => {
    console.log("Meeting ID:", meetingID);
    console.log("Password:", isSecure ? password : "Not Required");
    alert(
      `Joining Meeting: ${meetingID}\nPassword: ${isSecure ? password : "None"}`
    );
  };

  return (
    <div className="join-by-id-card">
      <h3>Join by Meeting ID</h3>
      <input
        type="text"
        placeholder="Enter Meeting ID"
        value={meetingID}
        onChange={(e) => setMeetingID(e.target.value)}
      />

      <div className="checkbox-row">
        <input
          type="checkbox"
          id="secure"
          checked={isSecure}
          onChange={(e) => setIsSecure(e.target.checked)}
        />
        <label htmlFor="secure">Password-protected</label>
      </div>

      {isSecure && (
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      <button className="join-button" onClick={handleJoin}>
        Join Meeting
      </button>
    </div>
  );
};

export default JoinByID;
