// 📁 src/components/RemoteAccess/RequestAccessForm.jsx
import React, { useState } from "react";
import "./RequestAccessForm.css";

const RequestAccessForm = ({ onConnect }) => {
  const [partnerCode, setPartnerCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!partnerCode) return;
    onConnect({ code: partnerCode, user: "You", status: "connected" });
  };

  return (
    <div className="request-access-form">
      <h3>Request Access</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter partner code"
          value={partnerCode}
          onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
        />
        <button type="submit">Connect</button>
      </form>
    </div>
  );
};

export default RequestAccessForm;
