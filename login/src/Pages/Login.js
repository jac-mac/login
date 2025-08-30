import React from "react";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Contexts/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successfulLogin, setSuccessfulLogin] = useState(true);
  const { setUserData } = useUserContext();

  let navigate = useNavigate();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    };
    try {
      const response = await fetch("http://localhost:3001/user/login", options);
      if (response.ok) {
        setEmail("");
        setPassword("");
        const userData = await response.json(); //extract accessToken to store in memory
        setUserData(userData);
        navigate("/dashboard");
      } else {
        setSuccessfulLogin(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-menu">
        <h1>ConnectSUS | Login</h1>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <section className="input-section">
            <input
              required
              autoComplete="off"
              name="email-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email..."
            />
            <input
              required
              name="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
            />
          </section>
          <section className='submit-signup-section'>
            <button type="submit">Login</button>
            <section className='signup-section'>
              <p>Don't have an account?</p>
              <a name="signup-link" href="signup">
                Sign-up Now
              </a>
            </section>
          </section>
        </form>
      </div>
      {successfulLogin ? null : (
        <p style={{ color: "red" }}>Incorrect credentials. Please try again.</p>
      )}
    </div>
  );
}
