import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../headers";
import DentalChart from "../dentalchart";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const VisitDetails = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState({
    doctor_name: "",
    reason: "",
    treatment: "",
    pre: "",
    post: "",
    intra_oral: "",
    extra_oral: "",
    cost: "",
    amountpaid: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisit = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/visit/${id}`
        );
        const visitData = response.data[0];
        setVisit(visitData);
        console.log(visit);
        console.log("Fetched visit data:", visit); // Debugging line
        setLoading(false);
      } catch (err) {
        setError("Error fetching visit data.");
        console.log(err);
        setLoading(false);
      }
    };
    fetchVisit();
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
          <div className="card mt-4" style={{ opacity: 0.9 }}>
            <div className="card-header">
              <h3>Visit Details</h3>
            </div>
            <div className="card-body">
              <form>
                {/* Form fields */}
                <div className="form-group">
                  <label htmlFor="doctor">Doctor</label>
                  <select className="form-control" id="doctor" required>
                    <option value={visit.doctor_name || ""}>
                      {visit.doctor_name || ""}
                    </option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="reason">Reason</label>
                  <input
                    type="text"
                    className="form-control"
                    id="reason"
                    placeholder="Enter reason"
                    value={visit.reason || ""}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="treatment">Treatment</label>
                  <textarea
                    className="form-control"
                    id="treatment"
                    rows="3"
                    placeholder="Enter treatment"
                    value={visit.treatment || ""}
                    readOnly
                  ></textarea>
                </div>

                <h3 className="mt-4">Images</h3>
                <div className="form-group">
                  <label>Radiographic Images</label>
                  <div className="mb-2">
                    <label htmlFor="pre-radiographic" className="d-block">
                      Pre
                    </label>
                    {visit.pre && visit.pre.length > 0 ? (
                      <div>
                        {visit.pre.map((path, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000/${path}`}
                            alt={`Pre image ${index + 1}`}
                            style={{ width: "200px", height: "auto" }}
                          />
                        ))}
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {/* <input
                      type="file"
                      className="form-control-file"
                      id="pre-radiographic"
                      value={visit.pre || ""}
                      multiple
                      readOnly
                    /> */}
                    <div
                      id="pre-radiographic-preview"
                      className="image-preview"
                    ></div>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="post-radiographic" className="d-block">
                      Post
                    </label>
                    {/* <input
                      type="file"
                      className="form-control-file"
                      id="post-radiographic"
                      value={visit.post || ""}
                      multiple
                      readOnly
                    /> */}
                    {visit.post && visit.post.length > 0 ? (
                      <div>
                        {visit.post.map((path, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000/${path}`}
                            alt={`Post image ${index + 1}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    <div
                      id="post-radiographic-preview"
                      className="image-preview"
                    ></div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="intraoral">Intraoral Images</label>
                  <br />
                  {/* <input
                    type="file"
                    className="form-control-file"
                    value={visit.intra_oral || ""}
                    id="intraoral"
                    multiple
                    readOnly
                  /> */}
                  {visit.intra_oral && visit.intra_oral.length > 0 ? (
                    <div>
                      {visit.intra_oral.map((path, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/${path}`}
                          alt={`Intra Oral image ${index + 1}`}
                          style={{ width: "200px", height: "auto" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p>No image available</p>
                  )}
                  <div id="intraoral-preview" className="image-preview"></div>
                </div>
                <div className="form-group">
                  <label htmlFor="extraoral">Extraoral Images</label>
                  <br />
                  {/* <input
                    type="file"
                    className="form-control-file"
                    id="extraoral"
                    value={visit.extra_oral || ""}
                    multiple
                    readOnly
                  /> */}
                  {visit.extra_oral && visit.extra_oral.length > 0 ? (
                    <div>
                      {visit.extra_oral.map((path, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/${path}`}
                          alt={`Extra Oral image ${index + 1}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <p>No image available</p>
                  )}
                  <div id="extraoral-preview" className="image-preview"></div>
                </div>

                {/* <DentalChart /> */}

                <div className="form-group">
                  <label htmlFor="Cost">Cost ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="Cost"
                    placeholder="Cost"
                    value={visit.cost || ""}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amountPaid">Amount Paid ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="amountPaid"
                    placeholder="Amount paid"
                    value={visit.amountpaid || ""}
                    readOnly
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitDetails;
