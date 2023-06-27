import React from "react";
import { useAuth } from "../contexts/AuthContext";
import "../css/login-signup.css";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
