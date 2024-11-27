import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { HttpStatusCode } from "axios";
import Header from "../headers";
import { useNavigate } from "react-router-dom";
import "../newpatient/New.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const token = localStorage.getItem("authToken");

// // Set default headers for Axios
// axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

const AddDoctor = () => {
  const [doctorName, setDoctorName] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/api/doctor`,
        { doctor_name: doctorName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Doctor added successfully!");
        setDoctorName(""); // Clear the form
        toast.success("Doctor added successfully!");
        setTimeout(() => navigate("/home"), 2000); // Redirect to home page
      }
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with a status other than 2xx
        if (err.response.status === 403) {
          console.error("Not Authorized to Add Doctor");
          setError("Not Authorized to Add Doctor.");
          toast.error("Not Authorized to Add Doctor.");
        } else {
          console.error("Error adding doctor:", err.response.data);
          setError("Failed to add doctor. Please try again.");
          toast.error("Error Adding doctor.");
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error("Error: No response received from server.");
        setError("Failed to add doctor. Please try again.");
        toast.error("Error: No response from server.");
      } else {
        // Something happened while setting up the request
        console.error("Unexpected error:", err.message);
        setError("An unexpected error occurred. Please try again.");
        toast.error("Unexpected error.");
      }
    }
  };
  return (
    <div>
      <div className="container">
        <Header customClassD="active" />
        <div
          className="displayArea"
          style={{ backgroundAttachment: "fixed", minHeight: "85vh" }}
        >
          <div className="card mt-4" style={{ opacity: 0.9 }}>
            <div className="card-header">
              <h3>Add New Doctor</h3>
            </div>
            <div className="card-body">
              {/* Success or error message */}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Add Doctor form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="doctorName">Doctor Name</label>
                  <input
                    type="text"
                    id="doctorName"
                    name="doctorName"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Add Doctor
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
