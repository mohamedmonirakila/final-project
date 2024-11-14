// client/src/App.jsx
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/homepage/Home";
import New from "./components/newpatient/New";
import File from "./components/file/File";
import VisitDetails from "./components/visitdetails/VisitDetails"; // Import VisitDetails component
import UpdatePatient from "./components/updatepatient/UpdatePatient";
import AllPatients from "./components/all patients/AllPatients";
import Doctors from "./components/doctors/Doctors";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

function App() {
  return (
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/file/:id" element={<File />} />
        <Route path="/visit/:id" element={<VisitDetails />} />
        <Route path="/update/:id" element={<UpdatePatient />} />
        <Route path="/patients" element={<AllPatients />} />
        <Route path="/doctor/summary" element={<Doctors />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeButton={true}
        style={{ zIndex: 9999 }}
      />
    </HashRouter>
  );
}

export default App;
