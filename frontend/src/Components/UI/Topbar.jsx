import React, { useContext, useState } from "react";
import "./Topbar.css";
import { useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { UserContext } from "../../context/UserContext";

const Topbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user } = useContext(UserContext);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const avatarUrl = user?.avatarUrl;

  return (
    <div className="topbar">
      <button
        onClick={() => toggleSidebar(!sidebarOpen)}
        className="hamburger-btn"
      >
        <Menu size={22} />
      </button>

      <div
        className="top-actions"
        onClick={() => {
          navigate("/settings");
        }}
      >
        {!imageError && avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="avatar"
            onError={() => setImageError(true)}
          />
        ) : (
          <User className="avatar" />
        )}
      </div>
    </div>
  );
};

export default Topbar;
