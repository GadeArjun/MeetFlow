import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      Landing
      <Link to={"/dashboard"}>Dashboard</Link>
    </div>
  );
}

export default Landing;
