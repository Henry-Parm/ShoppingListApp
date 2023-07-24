import React, { useState } from "react";
import "../css/navbar.css";
import "../css/fonts.css";
import Logout from "./AuthComponents/Logout";
import AddFoodItemButton from "./Buttons/AddFoodItemButton";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.svg'
import DashboardLogic from "./Dashboard/DashboardLogic";

export default function Navbar({ setResetOpen,setManageOverlay, manageOverlay, resetOpen, isOpen, setIsOpen, setShowItemOverlay, addItemClick }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const email = currentUser?.email
  const navigate = useNavigate();

  const {deleteSelected,
    moveToInactiveListInverse,
    moveToInactiveList,
    moveToActiveList,
    addList,
    handleLoginNav,
    handleResetOverlay,
    handleManageOverlay} = DashboardLogic({setManageOverlay,
      manageOverlay,
      resetOpen,
      setResetOpen})

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar-main">
      <div
        className={`navbar ${
          isLoginPage ? "landing-page-header-solid" : "landing-page-header"
        }`}
      >
        <div className="logo-div"><img src={logo} alt="" /></div>
        <nav className="landing-page-nav">

          <ul className={isOpen ? "nav-links open" : "nav-links"}>
          <button className="menu-button" onClick={addItemClick}>Add Item</button>
            <button className="menu-button" onClick={moveToInactiveList}>Set Inactive</button>
            <button className="menu-button" onClick={moveToActiveList}>Set Active</button>
            <button className="menu-button" onClick={moveToInactiveListInverse}>Deactivate Unselected</button>
            <button className="menu-button" onClick={deleteSelected}>Delete Selected</button>
            <button className="menu-button" onClick={handleManageOverlay}>Manage Lists</button>
            <button className="menu-button" onClick={handleResetOverlay}>Reset</button>
            {currentUser ? <Logout /> : <button className="menu-button" onClick={() => (navigate('/login'))}>Login</button>}
          
          </ul>
          {email ? (
            <p className="email-576" style={{ marginRight: "1em" }}>
              {email ? email : null}
            </p>
          ) : null}
          <div className={isOpen ? "hamburger open" : "hamburger"} onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </nav>
      </div>
      
    </div>
  );
}
