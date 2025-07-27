// 📁 src/pages/Settings/Preferences.jsx
import React, { useState } from "react";
import "./Preferences.css";

const Preferences = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const preferences = {
      darkMode,
      language,
      notifications,
    };
    console.log("Saved Preferences:", preferences);
    alert("Preferences saved successfully!");
  };

  return (
    <div className="preferences-settings">
      <h3>⚙️ App Preferences</h3>

      <div className="section">
        <label className="toggle">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Enable Dark Mode
        </label>
      </div>

      <div className="section">
        <label>Preferred Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div className="section">
        <label>Notification Preferences</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() => handleToggle("email")}
          />
          Email Notifications
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={notifications.sms}
            onChange={() => handleToggle("sms")}
          />
          SMS Notifications
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={() => handleToggle("push")}
          />
          Push Notifications
        </label>
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Preferences
      </button>
    </div>
  );
};

export default Preferences;
