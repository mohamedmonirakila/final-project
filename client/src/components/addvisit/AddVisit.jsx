import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DentalChart from '../dentalchart';

const AddVisitForm = ({ patientId }) => {
  const [doctors, setDoctors] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [reason, setReason] = useState('');
  const [treatment, setTreatment] = useState('');
  const [pre, setPre] = useState('');
  const [post, setPost] = useState('');
  const [intra_oral, setIntra] = useState('');
  const [extra_oral, setExtra] = useState('');
  const [cost, setCost] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const navigate = useNavigate();
  // Fetch doctor names when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, []);   



  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('doctor_name', doctorName);
    formData.append('reason', reason);
    formData.append('treatment', treatment);
    formData.append('cost', cost);
    formData.append('amount_paid', amountPaid);
    formData.append('patient_id', patientId)
  
    // Log formData entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/addvisit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Visit added successfully');
      navigate(`/home`);
    } catch (err) {
      console.error('Error:', err);
      alert('Error adding visit');
    }
  };
  

  return (
    <div className="card mt-4" style={{ opacity: 0.9 }}>
      <div className="card-header">
        <h3>ADD a New Visit</h3>
      </div>
      <div className="card-body">
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
          <div className="form-group">
          <label>Radiographic Images</label>
          <div className="mb-2">
            <label htmlFor="pre-radiographic">Pre-Radiographic Images</label>
            <br />
            <input
              type="file"
              className="form-control-file"
              id="pre-radiographic"
              multiple
              onChange={(e) => setPre(e.target.value)}
            />
            <div id="pre-radiographic-preview" className="image-preview"></div>
          </div>

          {/* Post Images */}
          <div className="mb-2">
            <label htmlFor="post-radiographic">Post-Radiographic Images</label>
            <br />
            <input
              type="file"
              className="form-control-file"
              id="post-radiographic"
              multiple
              onChange={(e) => setPost(e.target.value)}
            />
            <div id="post-radiographic-preview" className="image-preview"></div>
          </div>

          {/* Intraoral Images */}
          <div className="form-group">
            <label htmlFor="intraoral">Intraoral Images</label>
            <br />
            <input
              type="file"
              className="form-control-file"
              id="intraoral"
              multiple
              onChange={(e) => setIntra(e.target.value)}
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
              onChange={(e) => setExtra(e.target.value)}
            />
            <div id="extraoral-preview" className="image-preview"></div>
          </div>
          <DentalChart />
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