import ControlToolbar from "./Components/ControlToolbar";
import RemoteScreenPreview from "./Components/RemoteScreenPreview";
import "./DesktopToDesktopUI.css"; // <== Add this CSS file

export default function DesktopToDesktopUI() {
  return (
    <div className="remote-ui-container">
      <div className="remote-header">
        <h2>Connected to Dev-PC</h2>
        <div className="remote-status">
          ✅ Stable Connection <span className="timer">01:30:30</span>
        </div>
      </div>

      <RemoteScreenPreview device="desktop" />

      <ControlToolbar
        options={["Mouse", "Keyboard", "Clipboard", "File Transfer"]}
      />

      <div className="remote-actions">
        <button className="utility-btn">Send Ctrl+Alt+Del</button>
        <button className="utility-btn">Restart</button>
        <button className="end-btn">Stop Session</button>
      </div>
    </div>
  );
}
