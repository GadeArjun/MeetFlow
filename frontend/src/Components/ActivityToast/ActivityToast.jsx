import React, { useContext, useEffect, useState } from "react";
import "./ActivityToast.css";
import { UserContext } from "../../context/UserContext";

// type - join, leave, message
const ActivityToast = ({ message, type, onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  const { user } = useContext(UserContext);
  console.log(user);
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration); // default 5s

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // allow exit animation before unmount
  };

  if (user && user.name.toLowerCase() == message?.split(" ")[0].toLowerCase()) {
    return null;
  }

  return (
    <div className={`activity-toast ${type} ${visible ? "show" : "hide"}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default ActivityToast;
