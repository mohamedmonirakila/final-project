import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchPatient = ({ className, formClass, inputClass, buttonClass }) => {
  const [searchBy, setSearchBy] = useState("phone_number");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/api/search`,
        { searchBy, query },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Search Response:", response.data); // Log the response data

      if (response.data && response.data.id) {
        navigate(`/file/${response.data.id}`, {
          state: { patient: response.data },
        });
      } else {
        setError("Patient not found. add new patient.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        console.error("Error occurred while searching:", err);
        setError("An error occurred while searching.");
      }
    }
  };

  return (
    <div>
      <form className={formClass} role="search" onSubmit={handleSearch}>
        <select
          name="searchBy"
          className={className}
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="phone_number">Phone Number</option>
          <option value="name">Name</option>
        </select>
        <input
          type="search"
          className={inputClass}
          placeholder="Search..."
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={buttonClass}>
          Search
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SearchPatient;
