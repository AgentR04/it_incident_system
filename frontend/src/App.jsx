import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import IncidentForm from "./components/IncidentForm";
import IncidentDetails from "./components/IncidentDetails";

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚨 Incident Management System</h1>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/create">Create Incident</Link> |{" "}
        <Link to="/search">Search</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<IncidentForm />} />
        <Route path="/incidents/:id" element={<IncidentDetails />} />
        <Route path="/edit/:id" element={<IncidentForm />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  );
}
