import React from "react";
import "./NavBar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-item active">
        <span>🏠</span>
        <p>Home</p>
      </div>

      <div className="nav-item">
        <span>👤</span>
        <p>Profile</p>
      </div>
    </div>
  );
}

export default Navbar;