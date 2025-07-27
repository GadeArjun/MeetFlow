import React from "react";
import "./ActivityList.css";

const ActivityList = () => {
  const activities = [
    { id: 1, action: "Created meeting with Rahul", time: "2 mins ago" },
    { id: 2, action: "Ended remote session", time: "10 mins ago" },
    { id: 3, action: "Changed password", time: "1 hour ago" },
    { id: 4, action: "Updated profile picture", time: "Yesterday" },
  ];

  return (
    <ul className="activity-list">
      {activities.map((activity) => (
        <li key={activity.id} className="activity-item">
          <span>{activity.action}</span>
          <small>{activity.time}</small>
        </li>
      ))}
    </ul>
  );
};

export default ActivityList;
