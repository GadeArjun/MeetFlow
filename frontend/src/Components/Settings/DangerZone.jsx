// 📁 src/pages/Settings/DangerZone.jsx
import React from "react";
import "./DangerZone.css";
import { AlertTriangle, Trash2 } from "lucide-react";

const DangerZone = () => {
  const handleDelete = () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete your account? This action is irreversible."
    );
    if (confirmed) {
      alert("Your account has been deleted (simulation).");
      // TODO: Call actual delete API here
    }
  };

  return (
    <div className="danger-zone">
      <div className="danger-header">
        <AlertTriangle size={22} className="danger-icon" />
        <h3>Danger Zone</h3>
      </div>
      <p>
        This action is permanent and will remove all your data from the system.
        Please proceed with caution.
      </p>
      <button className="delete-button" onClick={handleDelete}>
        <Trash2 size={16} style={{ marginRight: "8px" }} />
        Delete Account Permanently
      </button>
    </div>
  );
};

export default DangerZone;
