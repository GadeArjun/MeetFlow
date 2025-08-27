// src/context/MeetingContext.jsx
import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

const MeetingContext = createContext();

export const MeetingContextProvider = ({ children }) => {
  const [meetingsData, setMeetingsData] = useState({
    scheduledMeetings: [],
    ongoingMeetings: [],
    pastMeetings: [],
    analytics: null,
  });
  const { token } = useContext(UserContext);
  const [meetingContextLoading, setMeetingContextLoading] = useState(true);

  const fetchMeetings = async () => {
    setMeetingContextLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/meeting`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      setMeetingsData({
        scheduledMeetings: data.scheduledMeetings || [],
        ongoingMeetings: data.ongoingMeetings || [],
        pastMeetings: data.pastMeetings || [],
        analytics: data.analytics || null,
      });

      console.log("Fetched meetings:", data);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    } finally {
      setMeetingContextLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [token]);

  const contextValue = {
    ...meetingsData, // gives direct access to scheduledMeetings, ongoingMeetings, pastMeetings, analytics
    fetchMeetings, // allow manual refresh
    meetingContextLoading,
    setMeetingsData,
  };

  return (
    <MeetingContext.Provider value={contextValue}>
      {children}
    </MeetingContext.Provider>
  );
};

export { MeetingContext };
