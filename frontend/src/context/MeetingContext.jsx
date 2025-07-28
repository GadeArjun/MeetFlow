import axios from "axios";
import React, { createContext, useState, useEffect } from "react"; // Import useState

const MeetingContext = createContext();

export const MeetingContextProvider = ({ children }) => {
  const [meetings, setMeetings] = useState([]);
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

      setMeetings(response.data.meetings || []);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    } finally {
      setMeetingContextLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Provide the context values
  const contextValue = {
    setMeetings,
    meetings,
    meetingContextLoading,
    setMeetingContextLoading,
  };

  return (
    <MeetingContext.Provider value={contextValue}>
      {" "}
      {/* Correct prop name is 'value' */}
      {children}
    </MeetingContext.Provider>
  );
};

// Export MeetingContext for consumption by other components
export { MeetingContext };
