// 📁 src/pages/Settings/SecuritySettings.jsx
import React, { useState } from "react";
import "./SecuritySettings.css";

const dummyDevices = [
  {
    name: "Windows Chrome",
    location: "Pune, India",
    lastActive: "Today, 3:20 PM",
  },
  {
    name: "Android Mobile",
    location: "Mumbai, India",
    lastActive: "Yesterday, 8:00 PM",
  },
  { name: "Macbook Safari", location: "Remote", lastActive: "2 days ago" },
];

const dummyLogs = [
  { action: "Logged in", timestamp: "2025-07-25 12:00 PM" },
  { action: "Enabled 2FA", timestamp: "2025-07-24 5:00 PM" },
  { action: "Password changed", timestamp: "2025-07-20 9:30 AM" },
];

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const toggle2FA = () => {
    setTwoFactorEnabled((prev) => !prev);
    alert(
      `Two-Factor Authentication ${!twoFactorEnabled ? "enabled" : "disabled"}`
    );
  };

  return (
    <div className="security-settings">
      <h3>🔒 Security Settings</h3>

      <div className="section">
        <label className="toggle">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={toggle2FA}
          />
          Enable Two-Factor Authentication (2FA)
        </label>
      </div>

      <div className="section">
        <h4>Active Sessions / Devices</h4>
        <ul className="device-list">
          {dummyDevices.map((device, index) => (
            <li key={index}>
              <strong>{device.name}</strong>
              <p>
                {device.location} • {device.lastActive}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h4>Recent Activity Logs</h4>
        <ul className="logs-list">
          {dummyLogs.map((log, index) => (
            <li key={index}>
              <strong>{log.action}</strong> <span>{log.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SecuritySettings;
