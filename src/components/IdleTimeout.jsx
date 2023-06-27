import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const IdleTimeout = ({ timeout, onTimeout }) => {
  const { logout } = useAuth();
  const [idleTimer, setIdleTimer] = useState(null);
  const resetTimer = () => {
    clearTimeout(idleTimer);
    setIdleTimer(setTimeout(logout, timeout));
  };

  useEffect(() => {
    const handleUserActivity = () => resetTimer();

    const resetTimerOnActivity = () => {
      document.addEventListener("mousemove", handleUserActivity);
      document.addEventListener("keydown", handleUserActivity);
      document.addEventListener("mousedown", handleUserActivity);
      document.addEventListener("touchstart", handleUserActivity);
    };

    resetTimerOnActivity();
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      document.removeEventListener("mousedown", handleUserActivity);
      document.removeEventListener("touchstart", handleUserActivity);
    };
  }, []);

  return null;
};

export default IdleTimeout;
