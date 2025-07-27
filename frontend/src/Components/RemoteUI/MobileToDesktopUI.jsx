import ControlToolbar from "./Components/ControlToolbar";
import RemoteScreenPreview from "./Components/RemoteScreenPreview";
import "./MobileToDesktopUI.css";

export default function MobileToDesktopUI() {
  return (
    <div className="remote-ui-container mobile-to-desktop-ui">
      <h3 className="mobile-to-desktop-title">🖥️ Controlling Dev-PC</h3>

      <RemoteScreenPreview device="desktop" />

      <ControlToolbar
        options={["File Transfer", "Send Keys", "Mouse", "Keyboard"]}
      />

      <div className="touch-pad">
        <div className="touch-icon-area">
          <span className="touch-label">🖱️ Touchpad</span>
        </div>
        <div className="keyboard-icon-area">
          <span className="touch-label">⌨️ Virtual Keyboard</span>
        </div>
      </div>
    </div>
  );
}
