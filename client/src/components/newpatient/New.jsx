import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './New.css'; // Import your CSS file
import Header from "../headers";

const New = () => {

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    birthdate: '',
    number: '',
    history: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/add', formData);
      setSuccess(response.data.message);
      setError('');
      setFormData({
        title: '',
        name: '',
        birthdate: '',
        number: '',
        history: '',
        address: '',
      });
      alert('Patient added successfully');
      navigate(`/home`);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while adding the patient.');
      }
    }
  };


  
  return (
    <div>
      <div className="container">
      <Header />

        <div className="display-area" style={{ backgroundAttachment: "fixed", minHeight: "85vh" }}>
          <div className="container pt-3 pb-1" style={{ opacity: 0.9, backgroundColor: 'white' }}>
            <h1 className="mb-4">Add New Patient</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
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
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter patient's name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="birthdate">Birthdate</label>
                <input
                  type="date"
                  className="form-control"
                  name="birthdate"
                  id="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="number">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
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
                  value={formData.history}
                  onChange={handleChange}
                  placeholder="Enter medical history"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="history">Address</label>
                <input
                  className="form-control"
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  required  
                ></input>
              </div>
              <button type="submit" className="btn btn-primary mt-2">
                Add Patient
              </button>
              {success && <p className="text-success mt-2">{success}</p>}
              {error && <p className="text-danger mt-2">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
