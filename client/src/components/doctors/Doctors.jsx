import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import axios from "axios";
import Header from "../headers";
import { useParams } from "react-router-dom";
import "../newpatient/New.css"; // Import your CSS file

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState("2050-01-01");

  // Fetch doctor summary based on start and end dates
  useEffect(() => {
    if (startDate && endDate) {
      const fetchDoctorSummary = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/doctor/summary",
            {
              params: { startDate, endDate },
            }
          );
          setDoctors(response.data);
          console.log(doctors);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching doctor summary:", err);
          setError("Error fetching doctor summary.");
          setLoading(false);
        }
      };
      fetchDoctorSummary();
    }
  }, [startDate, endDate]);

  // Handle date input change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
              <h3>All Doctors</h3>
            </div>
            <div className="card-body">
              {/* Date input form */}
              <form className="mb-4">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={handleDateChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    onChange={handleDateChange}
                    className="form-control"
                    required
                  />
                </div>
              </form>
              {/* Doctors table */}
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Cost</th>
                    <th>Payments</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, index) => (
                    <tr key={doctor.id || index}>
                      <td>{doctor.doctor_name}</td>
                      <td>{doctor.total_cost}</td>
                      <td>{doctor.total_amount_paid}</td>
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

export default Doctors;
