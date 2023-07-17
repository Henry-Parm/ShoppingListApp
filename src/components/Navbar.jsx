import React, { useState } from "react";
import "../css/navbar.css";
import "../css/fonts.css";
import Icon from "../assets/images/shopping-bag.png";
import Logout from "./AuthComponents/Logout";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setResetOpen }) {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const email = currentUser?.email
  const navigate = useNavigate();

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
          isLoginPage ? "landing-page-header-solid" : "landing-page-header"
        }`}
      >
        <h1 className="landing-page-title">My Grocery List</h1>
        <nav className="landing-page-nav">
          <div className="email" style={{ marginRight: "2em" }}>
            {email}
          </div>
          <ul className={isOpen ? "nav-links open" : "nav-links"}>
            {currentUser ? <Logout /> : <li className="logout-button" onClick={() => (navigate('/login'))}>Login</li>}
            <li>Contact</li>
            <li onClick={resetOpenHandler}>Reset</li>
          
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
