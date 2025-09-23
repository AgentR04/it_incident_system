import { useState } from "react";
import { createIncident } from "../api/incidentApi";

const IncidentForm = ({ onIncidentCreated }) => {
  const [incident, setIncident] = useState({
    title: "",
    description: "",
    status: "Open",
    severity: "Low",
  });

  const handleChange = (e) => {
    setIncident({ ...incident, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createIncident(incident)
      .then((res) => {
        alert("Incident created successfully!");
        setIncident({ title: "", description: "", status: "Open", severity: "Low" });
        if (onIncidentCreated) onIncidentCreated(res.data);
      })
      .catch((err) => console.error("Error creating incident:", err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Incident</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={incident.title}
        onChange={handleChange}
        required
      />
      <br />
      <textarea
        name="description"
        placeholder="Description"
        value={incident.description}
        onChange={handleChange}
        required
      />
      <br />
      <select name="status" value={incident.status} onChange={handleChange}>
        <option>Open</option>
        <option>In Progress</option>
        <option>Resolved</option>
      </select>
      <br />
      <select name="severity" value={incident.severity} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

export default IncidentForm;
