import React, { useState } from "react";
import "../css/navbar.css";
import "../css/fonts.css";
import Icon from "../assets/images/shopping-bag.png";
import Logout from "./Logout";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export default function Navbar({ setResetOpen }) {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const email = currentUser?.email

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const resetOpenHandler = () => {
    setResetOpen(true)
  }
  return (
    <div>
      <div
        className={`navbar ${
          isLandingPage ? "landing-page-header-solid" : "landing-page-header"
        }`}
      >
        <h1 className="landing-page-title">My Grocery List</h1>
        <nav className="landing-page-nav">
          <div className="email" style={{ marginRight: "2em" }}>
            {email}
          </div>
          <ul className={isOpen ? "nav-links open" : "nav-links"}>
            {currentUser ? <Logout /> : null}
            <li>Contact</li>
            {currentUser ? (
              <li onClick={resetOpenHandler}>Reset</li>
            ) : null}
          </ul>
          <div className="hamburger" onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </nav>
      </div>
      {email ? (
        <p className="email-576" style={{ marginRight: "2em" }}>
          {email ? email : null}
        </p>
      ) : null}
    </div>
  );
}
