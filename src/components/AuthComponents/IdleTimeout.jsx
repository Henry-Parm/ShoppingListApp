import { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

const IdleTimeout = ({ timeout }) => {
  const { logout, setDisplayLoggedOutMessage } = useAuth();
  const idleTimer = useRef(null);

  const handleTimeout = () =>{
    setDisplayLoggedOutMessage(true)
    logout()
    console.log('logout occured')
  }

  const resetTimer = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(handleTimeout, timeout);
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
      clearTimeout(idleTimer.current);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      document.removeEventListener("mousedown", handleUserActivity);
      document.removeEventListener("touchstart", handleUserActivity);
    };
  }, [timeout, logout]);

  return null;
};

export default IdleTimeout;
