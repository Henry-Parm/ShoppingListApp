import React from "react";
import "./css/App.css";
import "./components/CreateUser";
import { AuthProvider } from "./contexts/AuthContext";
import IdleTimeout from "./components/IdleTimeout";
import Router from "./Router";

function App() {
  const timeoutDuration = 15 * 60 * 1000;
  return (
    <div>
      <AuthProvider>
        <IdleTimeout
          timeout={timeoutDuration}
          onTimeout={() => console.log("User has been logged out")}
        />
        <Router />
      </AuthProvider>
    </div>
  );
}

export default App;
