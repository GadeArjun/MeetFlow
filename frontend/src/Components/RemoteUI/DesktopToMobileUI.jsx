import ControlToolbar from "./Components/ControlToolbar";
import RemoteScreenPreview from "./Components/RemoteScreenPreview";
import "./DesktopToMobileUI.css";

export default function DesktopToMobileUI() {
  return (
    <div className="remote-ui-container desktop-to-mobile-ui">
      <h2 className="desktop-to-mobile-title">📱 Connected to Galaxy A53</h2>

      <RemoteScreenPreview device="mobile" />

      <ControlToolbar
        options={["Rotate", "Screenshot", "Send Text", "App Drawer"]}
      />

      <div className="log-panel">
        <p className="log-heading">
          <strong>📝 Recent Logs:</strong>
        </p>
        <ul className="log-list">
          <li>✔️ Lock screen</li>
          <li>🔁 Rotate</li>
          <li>📸 Screenshot taken</li>
        </ul>
      </div>
    </div>
  );
}
