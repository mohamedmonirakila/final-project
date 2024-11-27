import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Header from "../headers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdatePatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    title: "",
    name: "",
    dateofbirth: "",
    phone_number: "",
    history: "",
    address: "",
  });
  /* const [success, setSuccess] = useState(""); */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/patient/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const patientData = {
          ...response.data,
          dateofbirth: response.data.dateofbirth
            ? format(new Date(response.data.dateofbirth), "yyyy-MM-dd") // Format as YYYY-MM-DD
            : "",
        };
        setPatient(patientData);
        console.log("Fetched patient data:", patientData); // Debugging line
        setLoading(false);
      } catch (err) {
        toast.error("Error fetching patient data.");
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.put(`${API_URL}/api/update/${id}`, patient, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }); // Use PUT for update
      console.log("Patient updated successfully");
      toast.success("Patient updated successfully!");
      setTimeout(() => {
        navigate(`/file/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Error updating patient data:", err);
      toast.error("An error occurred while updating the patient.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="container">
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="bounce" // Corrected here
      />
      <div
        className="display-area"
        style={{ backgroundAttachment: "fixed", minHeight: "85vh" }}
      >
        <div
          className="container pt-3 pb-1"
          style={{ opacity: 0.9, backgroundColor: "white" }}
        >
          <h1 className="mb-4">Update Patient Information</h1>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={patient.title || ""}
                onChange={handleInputChange}
                placeholder="Enter patient's Title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={patient.name || ""}
                onChange={handleInputChange}
                placeholder="Enter patient's name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateofbirth">Birthdate</label>
              <input
                type="date"
                className="form-control"
                name="dateofbirth"
                value={
                  patient.dateofbirth ? patient.dateofbirth.split("T")[0] : ""
                }
                id="dateofbirth"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone_number"
                name="phone_number"
                value={patient.phone_number || ""}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="history">Medical History</label>
              <textarea
                className="form-control"
                id="history"
                rows="3"
                name="history"
                value={patient.history || ""}
                onChange={handleInputChange}
                placeholder="Enter medical history"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="history">Address</label>
              <input
                className="form-control"
                id="address"
                type="text"
                name="address"
                value={patient.address || ""}
                onChange={handleInputChange}
                placeholder="Enter Address"
                required
              ></input>
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Update Patient
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UpdatePatient;
/* return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center border-bottom">
          <a
            href="/home"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          >
            <img
              src="/images/GLOW LOGO.svg"
              alt="logo svg"
              height="80px"
              width="100%"
            />
          </a>

          <ul className="nav nav-pills py-3">
            <li className="nav-item">
              <a href="/home" className="nav-link active" aria-current="page">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="./files" className="nav-link">
                Patient Files
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Doctors
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Laboratories
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Tools
              </a>  
            </li>
          </ul>
          </header>
      <div className="display-area" style={{ backgroundAttachment: "fixed", minHeight: "85vh" }}>
        <div className="container pt-3 pb-1" style={{ opacity: 0.9, backgroundColor: 'white' }}>
          <h1 className="mb-4">Update Patient Information</h1>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={patient.title}
                onChange={handleInputChange}
                placeholder="Enter patient's Title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={patient.name}
                onChange={handleInputChange}
                placeholder="Enter patient's name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateofbirth">Birthdate</label>
              <input
                type="date"
                className="form-control"
                name="dateofbirth"
                id="dateofbirth"
                value={patient.dateofbirth.split('T')[0]}  // Format the date correctly
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone_number"
                name="phone_number"
                value={patient.phone_number}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="history">Medical History</label>
              <textarea
                className="form-control"
                id="history"
                rows="3"
                name="history"
                value={patient.history}
                onChange={handleInputChange}
                placeholder="Enter medical history"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Update Patient
            </button>
          </form>
        </div> 
    </div>
    </div>
  );
};
*/
