import { useState } from "react";
import {
  MousePointer,
  Keyboard,
  Clipboard,
  FileUp,
  Power,
  X,
} from "lucide-react";
import "./ControlToolbar.css"; // we'll define this below

const ICONS = {
  Mouse: <MousePointer size={18} />,
  Keyboard: <Keyboard size={18} />,
  Clipboard: <Clipboard size={18} />,
  "File Transfer": <FileUp size={18} />,
  Restart: <Power size={18} />,
  "Stop Session": <X size={18} />,
};

export default function ControlToolbar({ options = [], onControlClick }) {
  const [activeStates, setActiveStates] = useState({});

  const handleToggle = (label) => {
    const updated = {
      ...activeStates,
      [label]: !activeStates[label],
    };
    setActiveStates(updated);
    onControlClick?.(label, updated[label]); // Emit action
  };

  return (
    <div className="control-toolbar">
      {options.map((label, idx) => {
        const isActive = activeStates[label] ?? true; // default to ON
        const isToggle = ["Mouse", "Keyboard"].includes(label);

        return (
          <button
            key={idx}
            className={`control-btn ${
              isToggle ? (isActive ? "active" : "inactive") : "static"
            }`}
            title={label}
            onClick={() => handleToggle(label)}
          >
            {ICONS[label]} <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
