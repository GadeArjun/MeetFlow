import React, { useState } from "react";
import "./Sidebar.css";
import {
  LayoutDashboard,
  Calendar,
  Video,
  Share,
  Settings,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Meetings", path: "/meetings" },
  { icon: Video, label: "Create Meeting", path: "/create-meeting" },
  { icon: Share, label: "Remote Access", path: "/remote-access" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const handleItemClick = () => {
    toggleSidebar(false); // to auto-close on mobile
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          {!isOpen && <h3 style={{ color: "white" }}>D</h3>}
          {isOpen && (
            <img
              src={logo} // Replace with your actual logo path
              alt="Deskly Logo"
              className="sidebar-logo"
            />
          )}
        </div>

        {/* Close icon shown only on small screens */}
        <button className="close-btn" onClick={()=>toggleSidebar()}>
          <X size={22} />
        </button>
      </div>

      <nav className="nav-links">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <Link
            onClick={() => handleItemClick()}
            to={path}
            key={label}
            className={`tooltip-item ${
              location.pathname === path ? "active" : ""
            }`}
          >
            <Icon size={20} />
            {isOpen && <span>{label}</span>}
            {!isOpen && <span className="tooltip-text">{label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
