import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/login-signup.css";

const LogoutButton = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/")
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <li onClick={handleLogout} className="logout-button">
      Logout
    </li>
  );
};

export default LogoutButton;
