import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../headers";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const VisitDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const [visit, setVisit] = useState({
  //   doctor_name: "",
  //   reason: "",
  //   treatment: "",
  //   cost: "",
  //   amountpaid: "",
  //   pre: [],
  //   post: [],
  //   intra_oral: [],
  //   extra_oral: [],
  // });
  const [doctors, setDoctors] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [reason, setReason] = useState("");
  const [treatment, setTreatment] = useState("");
  const [pre, setPre] = useState([]);
  const [post, setPost] = useState([]);
  const [intra, setIntra] = useState([]);
  const [extra, setExtra] = useState([]);
  const [cost, setCost] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [role, setRole] = useState(""); // State to store user role
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    setRole(decodedToken.role);
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

    const fetchVisit = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/visit/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const visitData = response.data[0];
        // setVisit(visitData);
        setDoctorName(visitData.doctor_name);
        setReason(visitData.reason);
        setTreatment(visitData.treatment);
        setPre(visitData.pre || []);
        setPost(visitData.post || []);
        setIntra(visitData.intra_oral || []);
        setExtra(visitData.extra_oral || []);
        setCost(visitData.cost || "");
        setAmountPaid(visitData.amountpaid || "");
        setPatientId(visitData.patient_id); // Make sure patient_id is correctly set here
        console.log(visitData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching visit data.");
        console.error(err);
        setLoading(false);
      }
    };
    fetchDoctors();
    fetchVisit();
  }, [id]);

  const handleFileChange = (e, setFiles, previewId) => {
    const files = Array.from(e.target.files);
    setFiles(files);

    // Update the preview
    const previewDiv = document.getElementById(previewId);
    previewDiv.innerHTML = "";

    files.forEach((file) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style =
        "width: 200px; height: 200px; margin: 5px; border-radius: 8px;";
      previewDiv.appendChild(img);
    });
  };

  const updateVisit = async () => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    // Append visit details
    formData.append("doctor_name", doctorName);
    formData.append("reason", reason);
    formData.append("treatment", treatment);
    formData.append("cost", cost);
    formData.append("amount_paid", amountPaid);
    formData.append("patient_id", patientId);

    // Append images (including the existing ones)
    // Pre Images
    if (pre.length > 0) {
      pre.forEach((file) => formData.append("pre", file));
    } else {
      // If no new pre images, append the existing ones (if any)
      pre.forEach((path) => formData.append("pre", path));
    }

    // Post Images
    if (post.length > 0) {
      post.forEach((file) => formData.append("post", file));
    } else {
      // If no new post images, append the existing ones (if any)
      post.forEach((path) => formData.append("post", path));
    }

    // Intraoral Images
    if (intra.length > 0) {
      intra.forEach((file) => formData.append("intra_oral", file));
    } else {
      // If no new intraoral images, append the existing ones (if any)
      intra.forEach((path) => formData.append("intra_oral", path));
    }

    // Extraoral Images
    if (extra.length > 0) {
      extra.forEach((file) => formData.append("extra_oral", file));
    } else {
      // If no new extraoral images, append the existing ones (if any)
      extra.forEach((path) => formData.append("extra_oral", path));
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/updatevisit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Visit updated successfully:", response.data);

      if (response.status === 200) {
        toast.success("Visit updated successfully.");
        navigate(`/file/${patientId}`);
      } else {
        toast.error("Error updating visit.");
      }
    } catch (err) {
      console.error("Error updating visit:", err);
      toast.error("An error occurred while updating the visit.");
    }
  };

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
          <div className="card mt-4" style={{ opacity: 0.9 }}>
            <div className="card-header">
              <h3>Visit Details</h3>
            </div>

            <div className="card-body">
              <form>
                {/* Doctor Selection */}
                <div className="form-group">
                  <label htmlFor="doctor">Doctor</label>
                  <select
                    className="form-control"
                    id="doctor"
                    name="doctor_id"
                    value={doctorName || ""}
                    onChange={(e) => setDoctorName(e.target.value)}
                    disabled={role !== "doctor" && role !== "admin"} // Disable if not doctor/admin
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
                <div className="form-group">
                  <label htmlFor="reason">Reason</label>
                  <input
                    type="text"
                    className="form-control"
                    id="reason"
                    value={reason || ""}
                    onChange={(e) => setReason(e.target.value)}
                    readOnly={role !== "doctor" && role !== "admin"} // Make it readonly if not doctor or admin
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="treatment">Treatment</label>
                  <textarea
                    className="form-control"
                    id="treatment"
                    rows="3"
                    value={treatment || ""}
                    onChange={(e) => setTreatment(e.target.value)}
                    readOnly={role !== "doctor" && role !== "admin"}
                    required // Make it readonly if not doctor or admin
                  ></textarea>
                </div>

                <h3 className="mt-4">Images</h3>
                {/* Pre Images */}
                <div className="form-group">
                  <label>Pre-Radiographic Images</label>
                  <br />
                  {/* Display old images */}

                  {/* File input to upload new images */}
                  {role === "doctor" || role === "admin" ? (
                    <>
                      <input
                        type="file"
                        className="form-control-file"
                        id="pre-radiographic"
                        multiple
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            setPre,
                            "pre-radiographic-preview"
                          )
                        }
                      />
                      <div
                        id="pre-radiographic-preview"
                        className="image-preview"
                      >
                        {pre.length > 0 &&
                          pre.map((path, index) => (
                            <img
                              key={index}
                              src={`http://localhost:5000/${path}`}
                              alt={`Pre image ${index + 1}`}
                              style={{
                                width: "200px",
                                height: "200px",
                                margin: "5px",
                                borderRadius: "8px",
                              }}
                            />
                          ))}
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="form-group">
                  <label>Post-Radiographic Images</label>
                  <br />
                  {role === "doctor" || role === "admin" ? (
                    <>
                      <input
                        type="file"
                        className="form-control-file"
                        id="post-radiographic"
                        multiple
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            setPost,
                            "post-radiographic-preview"
                          )
                        }
                      />
                      <div
                        id="post-radiographic-preview"
                        className="image-preview"
                      >
                        {post.map((path, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000/${path}`}
                            alt={`Post image ${index + 1}`}
                            style={{
                              width: "200px",
                              height: "200px",
                              margin: "5px",
                              borderRadius: "8px",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="form-group">
                  <label>Intraoral Images</label>
                  <br />
                  {role === "doctor" || role === "admin" ? (
                    <>
                      <input
                        type="file"
                        className="form-control-file"
                        id="intraoral"
                        multiple
                        onChange={(e) =>
                          handleFileChange(e, setIntra, "intraoral-preview")
                        }
                      />
                      <div id="intraoral-preview" className="image-preview">
                        {intra.map((path, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000/${path}`}
                            alt={`Intraoral image ${index + 1}`}
                            style={{
                              width: "200px",
                              height: "200px",
                              margin: "5px",
                              borderRadius: "8px",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="form-group">
                  <label>Extraoral Images</label>
                  <br />
                  {role === "doctor" || role === "admin" ? (
                    <>
                      <input
                        type="file"
                        className="form-control-file"
                        id="extraoral"
                        multiple
                        onChange={(e) =>
                          handleFileChange(e, setExtra, "extraoral-preview")
                        }
                      />
                      <div id="extraoral-preview" className="image-preview">
                        {extra.map((path, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000/${path}`}
                            alt={`extraoral image ${index + 1}`}
                            style={{
                              width: "200px",
                              height: "200px",
                              margin: "5px",
                              borderRadius: "8px",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Similar sections for Post, Intraoral, and Extraoral images */}

                {/* Cost */}
                <div className="form-group">
                  <label htmlFor="totalCost">Total Cost ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="totalCost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    readOnly={role !== "doctor" && role !== "admin"}
                    required // Make it readonly if not doctor or admin
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
                    readOnly={role !== "doctor" && role !== "admin"}
                    required // Make it readonly if not doctor or admin
                  />
                </div>

                {role === "doctor" || role === "admin" ? (
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={updateVisit}
                  >
                    Update Visit
                  </button>
                ) : null}
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default VisitDetails;
