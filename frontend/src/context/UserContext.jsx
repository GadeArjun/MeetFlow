import React, { createContext, useState, useEffect } from "react"; // Import useState

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Initialize token state
  const [userContextLoading, setUserContextLoading] = useState(true);

  // function to check token
  const checkToken = async () => {
    // Set loading to true at the start of the check
    setUserContextLoading(true);
    const storedToken = localStorage.getItem("token"); // Get token from localStorage
    if (storedToken) {
      setToken(storedToken); // Set the token state if found in localStorage
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`, // Use storedToken for the request
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // If token is invalid or API fails, clear user and token
          console.error(
            "Failed to fetch user data or token invalid:",
            response.status
          );
          localStorage.removeItem("token"); // Remove invalid token
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Error during token check:", error);
        localStorage.removeItem("token"); // Clear token on network error
        setUser(null);
        setToken(null);
      } finally {
        setUserContextLoading(false); // Always set loading to false when done
      }
    } else {
      // No token found in localStorage
      setUser(null);
      setToken(null);
      setUserContextLoading(false); // Set loading to false directly
    }
  };

  useEffect(() => {
    checkToken();
    // No dependencies means this runs once on mount, which is correct for initial token check
  }, []);

  // Provide the context values
  const contextValue = {
    user,
    setUser,
    token,
    setToken,
    userContextLoading,
    setUserContextLoading,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {" "}
      {/* Correct prop name is 'value' */}
      {children}
    </UserContext.Provider>
  );
};

// Export UserContext for consumption by other components
export { UserContext };
