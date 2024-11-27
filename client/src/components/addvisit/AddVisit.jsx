import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DentalChart from "../dentalchart";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddVisitForm = ({ patientId }) => {
  const [doctors, setDoctors] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [reason, setReason] = useState("");
  const [treatment, setTreatment] = useState("");
  const [pre, setPre] = useState([]);
  const [post, setPost] = useState([]);
  const [intraOral, setIntra] = useState([]);
  const [extraOral, setExtra] = useState([]);
  const [cost, setCost] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  // Fetch doctor names when the component mounts

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`${API_URL}/api/doctors`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        toast.error("Error fetching doctors.");
      }
    };

    fetchDoctors();
  }, []);

  const handleFileChange = (e, setImageState, previewId) => {
    const files = e.target.files;
    setImageState(files);
    const previewContainer = document.getElementById(previewId);
    previewContainer.innerHTML = "";
    Array.from(files).forEach((file) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      img.style.width = "200px";
      img.style.height = "200px";
      img.style.borderRadius = "8px";
      img.style.margin = "5px";
      img.style.opacity = "1"; // Ensures the image itself is fully opaque
      img.style.backgroundColor = "#fff"; // Add background color to avoid parent opacity effect

      previewContainer.appendChild(img);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("doctor_name", doctorName);
    formData.append("reason", reason);
    formData.append("treatment", treatment);
    formData.append("cost", cost);
    formData.append("amount_paid", amountPaid);
    formData.append("patient_id", patientId);

    // Append files if selected
    if (pre && pre.length > 0) {
      Array.from(pre).forEach((file) => formData.append("pre", file));
    }
    if (post && post.length > 0) {
      Array.from(post).forEach((file) => formData.append("post", file));
    }
    if (intraOral && intraOral.length > 0) {
      Array.from(intraOral).forEach((file) =>
        formData.append("intra_oral", file)
      );
    }
    if (extraOral && extraOral.length > 0) {
      Array.from(extraOral).forEach((file) =>
        formData.append("extra_oral", file)
      );
    }

    // Log formData entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await axios.post(`${API_URL}/api/addvisit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      toast.success("Visit added successfully");
      navigate(`/home`);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error adding visit");
      if (err.response) {
        // If the server responded with an error
        console.log("Response error:", err.response);
      } else if (err.request) {
        // If the request was made but no response was received
        console.log("Request error:", err.request);
      } else {
        // If something went wrong setting up the request
        console.log("Error", err.message);
      }
    }
  };

  return (
    <div className="card mt-4" style={{ opacity: 0.97 }}>
      <div className="card-header">
        <h3>ADD a New Visit</h3>
      </div>
      <div className="card-body">
        {/* Doctor Selection */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="doctor">Doctor</label>
            <select
              className="form-control"
              id="doctor"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reason Field */}
          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <input
              type="text"
              className="form-control"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              required
            />
          </div>

          {/* Treatment Field */}
          <div className="form-group">
            <label htmlFor="treatment">Treatment</label>
            <textarea
              className="form-control"
              id="treatment"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              rows="3"
              placeholder="Enter treatment"
              required
            ></textarea>
          </div>

          {/* Radiographic Images */}

          <h3 className="mt-4">Images</h3>
          {/* Pre Images */}
          <div className="form-group">
            <label>Radiographic Images</label>
            <div className="mb-2">
              <label>Pre-Radiographic Images</label>
              <br />
              <input
                type="file"
                className="form-control-file"
                id="pre-radiographic"
                multiple
                onChange={(e) =>
                  handleFileChange(e, setPre, "pre-radiographic-preview")
                }
              />
              <div
                id="pre-radiographic-preview"
                className="image-preview"
              ></div>
            </div>

            {/* Post Images */}
            <div className="mb-2">
              <label>Post-Radiographic Images</label>
              <br />
              <input
                type="file"
                className="form-control-file"
                id="post-radiographic"
                multiple
                onChange={(e) =>
                  handleFileChange(e, setPost, "post-radiographic-preview")
                }
              />
              <div
                id="post-radiographic-preview"
                className="image-preview"
              ></div>
            </div>

            {/* Intraoral Images */}
            <div className="form-group">
              <label>Intraoral Images</label>
              <br />
              <input
                type="file"
                className="form-control-file"
                id="intraoral"
                multiple
                onChange={(e) =>
                  handleFileChange(e, setIntra, "intraoral-preview")
                }
              />
              <div id="intraoral-preview" className="image-preview"></div>
            </div>

            {/* Extraoral Images */}
            <div className="form-group mb-2">
              <label htmlFor="extraoral">Extraoral Images</label>
              <br />
              <input
                type="file"
                className="form-control-file"
                id="extraoral"
                multiple
                onChange={(e) =>
                  handleFileChange(e, setExtra, "extraoral-preview")
                }
              />
              <div id="extraoral-preview" className="image-preview"></div>
            </div>
            {/* <DentalChart /> */}
            {/* Cost Fields */}
            <div className="form-group">
              <label htmlFor="totalCost">Total Cost ($)</label>
              <input
                type="number"
                className="form-control"
                id="totalCost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Total cost"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amountPaid">Amount Paid ($)</label>
              <input
                type="number"
                className="form-control"
                id="amountPaid"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Amount paid"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Add visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisitForm;
