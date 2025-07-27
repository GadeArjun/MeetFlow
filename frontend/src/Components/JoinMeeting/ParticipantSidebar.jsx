// 📁 src/components/Meeting/ParticipantSidebar.jsx
import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import "./ParticipantSidebar.css";

const ParticipantSidebar = ({ participants = [] }) => {
  const [remoteRequests, setRemoteRequests] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleRequestRemoteAccess = (participant) => {
    if (!remoteRequests.some((r) => r.id === participant.id)) {
      setRemoteRequests((prev) => [...prev, participant]);
    }
    setOpenMenuId(null);
  };

  const handleApprove = (id) => {
    alert(`Remote access granted to ${id}`);
    setRemoteRequests((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="join-meeting-sidebar">
      <h4>Participants</h4>
      <div className="sidebar-scroll">
        <ul className="participant-list">
          {participants.map((p) => (
            <li key={p.id} className="participant-item">
              <span>🟢 {p.name}</span>
              <div className="participant-actions">
                <button
                  className="more-options"
                  onClick={() =>
                    setOpenMenuId(openMenuId === p.id ? null : p.id)
                  }
                >
                  <MoreVertical size={16} />
                </button>

                {openMenuId === p.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleRequestRemoteAccess(p)}>
                      Request Remote Access
                    </button>
                    {/* Future Options */}
                    {/* <button>Mute</button> */}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {remoteRequests.length > 0 && (
          <>
            <hr />
            <h4>Remote Access Requests</h4>
            <ul className="request-list">
              {remoteRequests.map((req) => (
                <li key={req.id} className="request-item">
                  {req.name}
                  <button onClick={() => handleApprove(req.id)}>Approve</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ParticipantSidebar;
