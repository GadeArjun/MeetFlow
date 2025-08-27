import React, { useRef, useState } from "react";

// import "../styles/Layout.css"; // optional global layout styling
import Topbar from "../Components/UI/Topbar";
import Sidebar from "../Components/UI/Sidebar";
import ScrollToTop from "../Components/Utils/ScrollToTop";
import "./MainLayout.css";
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = (value = null) => {
    if (value != null) {
      setSidebarOpen(value);
    } else if (value == null) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const contentRef = useRef();
  return (
    <div
      className={`dashboard-container ${
        sidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <ScrollToTop scrollRef={contentRef} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content" ref={contentRef}>
        <Topbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="page-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
