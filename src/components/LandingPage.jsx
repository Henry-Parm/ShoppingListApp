import React, { useEffect } from "react";
import "../css/landingPage.css";
import Navbar from "./Navbar";
import SignIn from "./SignIn";
import CreateUser from "./CreateUser";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser]);

  return (
    <div>
      <Navbar />
      <div className="landing-page-hero">
        <div className="overlay">
          <p className="my-content">
            Welcome to my simple shopping list app. Throw a list of items
            together, and label ones to be shown on a weekly, biweekly, or
            monthly basis lorem
          </p>
        </div>
        <div className="input-container-landing">
          <SignIn />
          <CreateUser />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
