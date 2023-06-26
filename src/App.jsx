import React from "react";
import "./css/App.css";
import "./components/CreateUser";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./Router";

function App() {
  return (
    <div>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </div>
  );
}

export default App;
