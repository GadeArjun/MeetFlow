// 📁 src/pages/Settings/Settings.jsx
import React, { useContext } from "react";
import "./Settings.css";
import ProfileSettings from "../../Components/Settings/ProfileSettings";
import AccountSettings from "../../Components/Settings/AccountSettings";
// import Preferences from "../../Components/Settings/Preferences";
import DangerZone from "../../Components/Settings/DangerZone";
import Meta from "../../Components/Meta/Meta";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Settings = () => {
  const { setToken, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored auth data
    localStorage.removeItem("token");
    localStorage.removeItem("meetingId");

    // Navigate to home page
    // window.location.href = "/";
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <Meta page={"meetingSettings"} />
      <div className="settings-scroll-container">
        <h2 className="settings-title">Settings</h2>

        {/* Logout Button */}
        <section className="settings-section logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </section>

        <section className="settings-section">
          <ProfileSettings />
        </section>

        <section className="settings-section">
          <AccountSettings />
        </section>

        {/* <section className="settings-section">
        <Preferences />
      </section> */}

        {/* <section className="settings-section">
          <DangerZone />
        </section> */}
      </div>
    </>
  );
};

export default Settings;
