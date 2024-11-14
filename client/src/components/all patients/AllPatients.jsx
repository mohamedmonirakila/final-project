import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import axios from "axios";
import Header from "../headers";
import { useParams } from "react-router-dom";

const AllPatients = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const [patients, setPatients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amountsDue, setAmountsDue] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patients");
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Error fetching patient data.");
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Fetch amounts due once patients are available
  useEffect(() => {
    if (patients && patients.length > 0) {
      const fetchAmountsDue = async () => {
        try {
          const updatedAmountsDue = {};
          for (const patient of patients) {
            const response = await axios.get(
              `http://localhost:5000/api/amountdue/${patient.id}`
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
                      /* onClick={() =>
                        (window.location.href = `/file/${patient.id}`)
                      }
                      style={{ cursor: "pointer" }} */
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
                      <td>
                        <Link
                          to={`/file/${patient.id}`}
                          className="btn btn-link"
                        >
                          View Details
                        </Link>
                      </td>
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
