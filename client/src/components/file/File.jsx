import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./File.css"; // Import your CSS file
import axios from "axios";
import AddVisitForm from "../addvisit/AddVisit";
import Header from "../headers";
import { useParams } from "react-router-dom";

const File = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState("0.00"); // State for Amount Due

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientResponse, visitsResponse, amountDueResponse] =
          await Promise.all([
            axios.get(`http://localhost:5000/api/patient/${id}`),
            axios.get(`http://localhost:5000/api/visits/${id}`),
            axios.get(`http://localhost:5000/api/amountdue/${id}`),
          ]);

        setPatient(patientResponse.data);
        setVisits(visitsResponse.data);
        setRemainingAmount(amountDueResponse.data.amountDue);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="container">
        <Header />
        <div
          className="displayArea"
          style={{ backgroundAttachment: "fixed", minHeight: "85vh" }}
        >
          <div className="container mt-5">
            <Link
              to={`/update/${patient.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="card" style={{ opacity: 0.9 }}>
                <div className="card-header">
                  <h3>Patient Information</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Personal Details</h5>
                      <p>
                        <strong>Name:</strong> {patient.title} : {patient.name}
                      </p>
                      <p>
                        <strong>Age:</strong> {patient.age}
                      </p>
                      <p>
                        <strong>History:</strong> {patient.history}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h5>Contact Details</h5>
                      <p>
                        <strong>Phone:</strong> {patient.phone_number}
                      </p>
                      <p>
                        <strong>Amount due: </strong> {remainingAmount}
                      </p>
                      <p>
                        <strong>Address:</strong> {patient.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <AddVisitForm patientId={patient.id} />
            <div className="card mt-4" style={{ opacity: 0.9 }}>
              <div className="card-header">
                <h3>Visits History</h3>
              </div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Doctor</th>
                      <th>Reasno</th>
                      <th>Cost</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((visit) => (
                      <tr
                        key={visit.id}
                        onClick={() =>
                          (window.location.href = `#/visit/${visit.id}`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{visit.visit_date}</td>
                        <td>{visit.doctor_name}</td>
                        <td>{visit.reason}</td>
                        <td>{visit.cost}</td>
                        <td>{visit.amount_paid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default File;
