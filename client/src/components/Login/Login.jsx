import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook
  const API_URL = "http://localhost:5000";
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token to localStorage
        localStorage.setItem("authToken", data.token);
        console.log("Login successful!", data);
        navigate("/home"); // Redirect to /home on successful login
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center py-4 bg-body-tertiary"
      style={{ height: "100%" }}
    >
      <main className="form-signin">
        <form onSubmit={handleLogin}>
          <img
            className="mb-4"
            src="./images/GLOW-LOGO.svg"
            alt="logo img"
            width="150"
            height="100"
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <h1 className="h3 mb-3 fw-normal text-center">Hello Doctor!</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="floatingInput">Username</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">
            Login
          </button>
          <p className="mt-5 mb-3 text-center">© Monir 2024</p>
        </form>
      </main>
    </div>
  );
};

export default Login;
