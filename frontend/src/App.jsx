import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Landing from "./Pages/Landing/Landing";
import Meetings from "./Pages/Meetings/Meetings";
import MainLayout from "./layouts/MainLayout";
import CreateMeeting from "./Pages/CreateMeeting/CreateMeeting";
import RemoteAccess from "./Pages/RemoteAccess/RemoteAccess";
import Settings from "./Pages/Settings/Settings";
import JoinMeeting from "./Pages/JoinMeeting/JoinMeeting";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/meetings"
          element={
            <MainLayout>
              <Meetings />
            </MainLayout>
          }
        />
        <Route
          path="/create-meeting"
          element={
            <MainLayout>
              <CreateMeeting />
            </MainLayout>
          }
        />

        <Route
          path="/remote-access"
          element={
            <MainLayout>
              <RemoteAccess />
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />

        <Route
          path="/a"
          element={
           <JoinMeeting/>
          }
        />
      </Routes>
    </>
  );
}

export default App;
