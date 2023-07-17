import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../css/login-signup.css";

function SignIn() {
  const { login, handleGoogleSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await login(email.toLowerCase(), password);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-component-container">
      <div className="login-component">
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {errorMessage ? (
          <p className="error-message-sign-in">{errorMessage}</p>
        ) : (
          <br />
        )}
        <br />
        <button className="google-button" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default SignIn;
