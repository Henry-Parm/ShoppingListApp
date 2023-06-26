import React, { useState } from "react";

//DB dependencies. Might be needed elsewhere
import "../css/login-signup.css";
import { useAuth } from "../contexts/AuthContext";

export default function CreateUser() {
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    password1: "",
    password2: "",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (formData.password1 !== formData.password2) {
      alert("Passwords do not match");
      return;
    }

    await signup(formData.username.toLowerCase(), formData.firstName, formData.password1);
  }

  return (
      <div className="signup-component">
        <form onSubmit={handleSubmit}>
          <h2>Don't have an account?</h2>
          <input
            type="email"
            id="email"
            name="username"
            placeholder="Email"
            value={formData.username}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="first-name"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="password"
            id="password"
            name="password1"
            placeholder="Password"
            value={formData.password1}
            onChange={handleInputChange}
          />
          <input
            type="password"
            id="passwordConfirm"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleInputChange}
          />
          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>
      </div>
  );
}
