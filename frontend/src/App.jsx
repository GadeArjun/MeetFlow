import React, { useContext, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Landing from "./Pages/Landing/Landing";
import Meetings from "./Pages/Meetings/Meetings";
import MainLayout from "./layouts/MainLayout";
import CreateMeeting from "./Pages/CreateMeeting/CreateMeeting";
import RemoteAccess from "./Pages/RemoteAccess/RemoteAccess";
import Settings from "./Pages/Settings/Settings";
import JoinMeeting from "./Pages/JoinMeeting/JoinMeeting";
import RemoteController from "./Pages/RemoteController/RemoteController";
import { UserContext } from "./context/UserContext";
import FullScreenLoader from "./Pages/Loading/FullScreenLoader";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

function App() {
  const { user, userContextLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userContextLoading) {
      return;
    }
    if (!user) {
      navigate("/login");
    }
  }, [user, userContextLoading]);

  if (userContextLoading) {
    return <FullScreenLoader />;
  }
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
        <Route path="/join-meeting/:meetingID" element={<JoinMeeting />} />
        <Route
          path="/remote-controller"
          element={<RemoteController targetDevice={"mobile"} />}
        />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
