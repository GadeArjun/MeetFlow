// 📁 src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ scrollRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (scrollRef?.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [pathname, scrollRef]);

  return null;
};

export default ScrollToTop;
