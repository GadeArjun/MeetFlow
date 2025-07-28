import React, { useContext, useState } from "react";
import "./Topbar.css";
import { Menu, User } from "lucide-react";
import { UserContext } from "../../context/UserContext";

const Topbar = ({ toggleSidebar }) => {
  const { user } = useContext(UserContext);
  const [imageError, setImageError] = useState(false);

  const avatarUrl = user?.avatarUrl;

  return (
    <div className="topbar">
      <button onClick={toggleSidebar} className="hamburger-btn">
        <Menu size={22} />
      </button>

      <div className="top-actions">
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
