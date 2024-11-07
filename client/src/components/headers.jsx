import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Header = (props) => {
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
