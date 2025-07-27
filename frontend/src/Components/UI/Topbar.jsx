import React from "react";
import "./Topbar.css";
import { Menu, SunMoon, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <button onClick={()=>toggleSidebar()} className="hamburger-btn">
        <Menu size={22} />
      </button>
      <div className="top-actions">
        <img src="/user.png" alt="Profile" className="avatar" />
      </div>
    </div>
  );
};

export default Topbar;
