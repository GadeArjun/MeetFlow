import React, { useState } from "react";
import "./RemoteAccess.css";
import AccessCodeBox from "../../Components/RemoteAccess/AccessCodeBox";
import RequestAccessForm from "../../Components/RemoteAccess/RequestAccessForm";
import SessionStatusPanel from "../../Components/RemoteAccess/SessionStatusPanel";
import PermissionToggles from "../../Components/RemoteAccess/PermissionToggles";
import PreviousSessions from "../../Components/RemoteAccess/PreviousSessions";

const RemoteAccess = () => {
  const [permissions, setPermissions] = useState({
    view: true,
    control: false,
    camera: false,
  });

  const [accessCode, setAccessCode] = useState("");
  const [session, setSession] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const [previousSessions, setPreviousSessions] = useState([]);

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const timestamp = new Date().toLocaleString();

    setAccessCode(code);
    setIsGenerated(true);

    const newSession = {
      code,
      timestamp,
      permissions: { ...permissions },
    };

    setPreviousSessions([newSession, ...previousSessions]);
    console.log("Access permissions:", permissions);
  };

  const endSession = () => {
    setAccessCode("");
    setIsGenerated(false);
  };

  return (
    <div className="remote-access-page">
      <h2>Remote Access Control</h2>

      <div className="remote-access-grid">
        <div>
          <PermissionToggles
            permissions={permissions}
            setPermissions={setPermissions}
            disabled={isGenerated}
          />
          {!isGenerated && (
            <button className="generate-btn" onClick={generateCode}>
              Generate Access ID
            </button>
          )}
        </div>

        {isGenerated && (
          <AccessCodeBox
            accessCode={accessCode}
            onEnd={endSession}
            showPermissions={permissions}
          />
        )}
      </div>

      <RequestAccessForm onConnect={setSession} />

      {session && (
        <SessionStatusPanel session={session} onEnd={() => setSession(null)} />
      )}

      {previousSessions.length > 0 && (
        <PreviousSessions sessions={previousSessions} />
      )}
    </div>
  );
};

export default RemoteAccess;
