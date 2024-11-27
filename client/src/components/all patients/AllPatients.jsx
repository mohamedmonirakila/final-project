import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import axios from "axios";
import Header from "../headers";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const AllPatients = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const navigate = useNavigate();
  const [patients, setPatients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amountsDue, setAmountsDue] = useState({});
  const [role, setRole] = useState(null);
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role); // Set the role from the decoded token
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/patients`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Error fetching patient data.");
        setLoading(false);
      }
    };
    fetchPatients();
  }, [patients]);

  // Fetch amounts due once patients are available
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (patients && patients.length > 0) {
      const fetchAmountsDue = async () => {
        try {
          const updatedAmountsDue = {};
          for (const patient of patients) {
            const response = await axios.get(
              `${API_URL}/api/amountdue/${patient.id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            updatedAmountsDue[patient.id] = response.data.amountDue;
          }
          setAmountsDue(updatedAmountsDue);
        } catch (err) {
          console.error("Error fetching amounts due:", err);
        }
      };
      fetchAmountsDue();
    }
  }, [patients]);

  // Function to handle patient deletion
  const deletePatient = async (patientId) => {
    try {
      const token = localStorage.getItem("authToken");

      // Call the delete patient API
      const response = await axios.delete(
        `${API_URL}/api/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Patient, visits, and payments deleted successfully.");
        navigate("/patients"); // Navigate to a patients list page or another relevant page
      }
    } catch (err) {
      console.error("Error deleting patient:", err);
      toast.error("An error occurred while deleting the patient.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="container">
        <Header customClassP="active" />
        <div
          className="displayArea"
          style={{ backgroundAttachment: "fixed", minHeight: "85vh" }}
        >
          <div className="card mt-4" style={{ opacity: 0.9 }}>
            <div className="card-header">
              <h3>All Patients</h3>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>History</th>
                    <th>Amount Due</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      onClick={() =>
                        (window.location.href = `#/file/${patient.id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>{patient.title}</td>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.history}</td>
                      <td>
                        {amountsDue[patient.id] !== undefined
                          ? `$${amountsDue[patient.id].toFixed(2)}`
                          : "Loading..."}
                      </td>
                      {role === "admin" && (
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click from firing
                              deletePatient(patient.id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPatients;
