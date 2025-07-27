// 📁 src/Components/RemoteUI/MobileToMobileUI.jsx
import ControlToolbar from "./Components/ControlToolbar";
import RemoteScreenPreview from "./Components/RemoteScreenPreview";
import "./MobileToMobileUI.css";

export default function MobileToMobileUI() {
  return (
    <div className="remote-ui-container mobile-ui">
      <h3 className="mobile-ui-title">📱 Controlling Pixel 6 Pro</h3>
      <RemoteScreenPreview device="mobile" />
      <ControlToolbar options={["Touch", "Swipe", "Keyboard", "App List"]} />
    </div>
  );
}
