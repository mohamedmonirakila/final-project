// client/src/App.jsx
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/homepage/Home";
import New from "./components/newpatient/New";
import File from "./components/file/File";
import VisitDetails from "./components/visitdetails/VisitDetails"; // Import VisitDetails component
import UpdatePatient from "./components/updatepatient/UpdatePatient";
import AllPatients from "./components/all patients/AllPatients";
import Doctors from "./components/doctors/Doctors";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/file/:id" element={<File />} />{" "}
        {/* Dynamic route for patient file */}
        <Route path="/visit/:id" element={<VisitDetails />} />{" "}
        {/* Dynamic route for visit details */}
        <Route path="/update/:id" element={<UpdatePatient />} />
        <Route path="/patients" element={<AllPatients />} />
        <Route path="/doctor/summary" element={<Doctors />} />
      </Routes>
    </Router>
  );
}

export default App;
