// 📁 src/pages/Settings/Settings.jsx
import React from "react";
import "./Settings.css";
import ProfileSettings from "../../Components/Settings/ProfileSettings";
import AccountSettings from "../../Components/Settings/AccountSettings";
import Preferences from "../../Components/Settings/Preferences";
import SecuritySettings from "../../Components/Settings/SecuritySettings";
import DangerZone from "../../Components/Settings/DangerZone";

const Settings = () => {
  return (
    <div className="settings-scroll-container">
      <h2 className="settings-title">Settings</h2>

      <section className="settings-section">
        <ProfileSettings />
      </section>

      <section className="settings-section">
        <AccountSettings />
      </section>

      <section className="settings-section">
        <Preferences />
      </section>

      <section className="settings-section">
        <SecuritySettings />
      </section>

      <section className="settings-section">
        <DangerZone />
      </section>
    </div>
  );
};

export default Settings;
