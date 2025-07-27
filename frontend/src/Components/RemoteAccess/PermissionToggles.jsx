import React from "react";
import "./PermissionToggles.css";

const labelMap = {
  screen: "Screen Sharing",
  keyboard: "Keyboard Access",
  mouse: "Mouse Control",
  camera: "Camera Access",
  view: "Allow View",
  control: "Allow Control",
  fileTransfer: "File Transfer",
  // Add more if needed
};

const PermissionToggles = ({
  permissions,
  setPermissions,
  disabled = false,
}) => {
  const toggle = (key) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  return (
    <div className="permissions">
      <h4>Permissions</h4>
      <div className="permission-group">
        {Object.entries(permissions).map(([key, value]) => (
          <label key={key} className="toggle-label">
            <input
              type="checkbox"
              checked={value}
              onChange={() => toggle(key)}
              disabled={disabled}
            />
            <span>{labelMap[key] || key}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PermissionToggles;
