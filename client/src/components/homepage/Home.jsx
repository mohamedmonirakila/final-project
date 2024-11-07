import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./Home.css"; // Import your CSS file
import SearchPatient from "../Search";
import Header from "../headers";

const Home = () => {
  return (
    <div>
      <div className="container">
        <Header customClassH="active" />
      </div>
      <header className="py-2 border-bottom">
        <div className="container d-flex flex-wrap justify-content-center">
          <a
            href="#/new"
            className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none"
          >
            <button type="button" className="btn btn-primary">
              ADD NEW Patient
            </button>
          </a>
          <SearchPatient
            formClass="col-12 col-lg-auto mb-3 mb-lg-0 d-flex align-items-center"
            className="form-select me-2"
            inputClass="form-control me-2"
            buttonClass="btn btn-primary"
          />
        </div>
      </header>
      <div className="display-area"></div>
    </div>
  );
};

export default Home;
