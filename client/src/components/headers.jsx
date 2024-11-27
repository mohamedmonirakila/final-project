import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const decodeJWT = (token) => {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const Header = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("authToken");

    if (token) {
      // Decode the token to get user role (assuming it's in the token payload)
      const decodedToken = decodeJWT(token);

      if (decodedToken && decodedToken.role === "admin") {
        setIsAdmin(true); // Set the user as admin if the role is 'admin'
      }
    }
  }, []);

  return (
    <div>
      <header className="d-flex flex-wrap justify-content-center border-bottom">
        <a
          href="#/home"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <img
            src="./images/GLOW-LOGO.svg"
            alt="logo svg"
            height="80px"
            width="100%"
          />
        </a>

        <ul className="nav nav-pills py-3">
          <li className="nav-item">
            <a
              href="#/home"
              className={`nav-link ${
                props.customClassH ? props.customClassH : ""
              }`}
              aria-current="page"
            >
              Home
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#/patients"
              className={`nav-link ${
                props.customClassP ? props.customClassP : ""
              }`}
            >
              Patient Files
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#/doctor/summary"
              className={`nav-link ${
                props.customClassD ? props.customClassD : ""
              }`}
              // Disable or add class if not admin
              aria-disabled={!isAdmin}
              style={{
                pointerEvents: isAdmin ? "auto" : "none",
                opacity: isAdmin ? 1 : 0.5,
              }}
            >
              Doctors
            </a>
          </li>
          {/* <li className="nav-item">
            <a href="#" className="nav-link">
              Laboratories
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              Tools
            </a>
          </li> */}
        </ul>
      </header>
    </div>
  );
};

export default Header;
