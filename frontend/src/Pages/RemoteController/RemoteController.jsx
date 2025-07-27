import { useEffect, useState } from "react";
import { getDeviceType } from "../../Components/Utils/detectDevice";
import DesktopToDesktopUI from "../../Components/RemoteUI/DesktopToDesktopUI";
import MobileToMobileUI from "../../Components/RemoteUI/MobileToMobileUI";
import DesktopToMobileUI from "../../Components/RemoteUI/DesktopToMobileUI";
import MobileToDesktopUI from "../../Components/RemoteUI/MobileToDesktopUI";

export default function RemoteController() {
  const [deviceType, setDeviceType] = useState(null);
  const [remoteType, setRemoteType] = useState(null); // 'desktop', 'mobile'

  useEffect(() => {
    const local = "desktop" || getDeviceType();
    const remote =
      new URLSearchParams(window.location.search).get("remote") || "desktop";
    console.log({ local, remote });
    setDeviceType(local);
    setRemoteType(remote);
  }, []);

  if (!deviceType || !remoteType)
    return <div>Loading remote controller...</div>;

  if (deviceType === "desktop" && remoteType === "desktop")
    return <DesktopToDesktopUI />;
  if (deviceType === "mobile" && remoteType === "mobile")
    return <MobileToMobileUI />;
  if (deviceType === "desktop" && remoteType === "mobile")
    return <DesktopToMobileUI />;
  if (deviceType === "mobile" && remoteType === "desktop")
    return <MobileToDesktopUI />;
}
