// 📁 src/components/Dashboard/DashboardCard.jsx
import React from "react";
import "./DashboardCard.css";
import * as Icons from "lucide-react";

const DashboardCard = ({ title, value, icon }) => {
  const LucideIcon = icon ? Icons[icon] : null;

  return (
    <div className="dashboard-card">
      <div className="icon-container">
        {LucideIcon && <LucideIcon className="card-icon" size={28} />}
      </div>
      <div className="card-info">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
