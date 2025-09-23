import { useEffect, useState } from "react";
import { getAllIncidents, deleteIncident } from "../api/incidentApi";

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    getAllIncidents()
      .then((res) => setIncidents(res.data))
      .catch((err) => console.error("Error fetching incidents:", err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      deleteIncident(id)
        .then(() => {
          setIncidents(incidents.filter((i) => i.id !== id));
        })
        .catch((err) => console.error("Error deleting:", err));
    }
  };

  return (
    <div>
      <h2>All Incidents</h2>
      <ul>
        {incidents.map((incident) => (
          <li key={incident.id}>
            <strong>{incident.title}</strong> - {incident.status} <br />
            {incident.description} <br />
            <button onClick={() => handleDelete(incident.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncidentList;
