import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import "./RemoteScreenPreview.css";

export default function RemoteScreenPreview({ device }) {
  const [imageLoaded, setImageLoaded] = useState(true);

  const fallbackIcon =
    device === "desktop" ? <Monitor size={64} /> : <Smartphone size={64} />;
  const streamSrc =
    device === "desktop"
      ? "https://your-domain.com/live/desktop-stream.jpg" // 🔁 Replace with your stream/snapshot URL
      : "https://your-domain.com/live/mobile-stream.jpg";

  const handleError = () => {
    setImageLoaded(false);
  };

  return (
    <div className="screen-preview">
      {imageLoaded ? (
        <img
          src={streamSrc}
          alt={`${device} live preview`}
          className="device-preview"
          onError={handleError}
        />
      ) : (
        <div className="fallback-preview">
          {fallbackIcon}
          <p className="fallback-text">Live preview not available</p>
        </div>
      )}
    </div>
  );
}
