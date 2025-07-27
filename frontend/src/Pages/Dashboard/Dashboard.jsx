import React from "react";
import DashboardCard from "../../Components/Dashboard/DashboardCard";
import ActivityList from "../../Components/Dashboard/ActivityList";
import "./Dashboard.css";

const Dashboard = () => {
  const cards = [
    {
      title: "Total Meetings",
      value: "124",
      icon: "Video",
    },
    {
      title: "Scheduled Meetings",
      value: "5 Today",
      icon: "CalendarClock",
    },
    {
      title: "Active Remote Sessions",
      value: "2 live",
      icon: "Monitor",
    },
    {
      title: "Recent Logins",
      value: "3 Devices",
      icon: "LogIn",
    },
  ];

  return (
    <div className="dashboard-body">
      <h2 className="dashboard-title">Welcome back, Arjun</h2>

      <div className="cards-grid">
        {cards.map((card, idx) => (
          <DashboardCard
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <section className="dashboard-section">
        <h3 className="section-title">Recent Activity</h3>
        <ActivityList />
      </section>
    </div>
  );
};

export default Dashboard;
