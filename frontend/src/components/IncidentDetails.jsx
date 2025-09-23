import { useEffect, useState } from "react";
import { getIncidentById } from "../api/incidentApi";

const IncidentDetails = ({ incidentId }) => {
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    if (incidentId) {
      getIncidentById(incidentId)
        .then((res) => setIncident(res.data))
        .catch((err) => console.error("Error fetching incident:", err));
    }
  }, [incidentId]);

  if (!incidentId) {
    return <p>Select an incident to view details</p>;
  }

  if (!incident) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Incident Details</h2>
      <p>
        <strong>Title:</strong> {incident.title}
      </p>
      <p>
        <strong>Description:</strong> {incident.description}
      </p>
      <p>
        <strong>Status:</strong> {incident.status}
      </p>
      <p>
        <strong>Severity:</strong> {incident.severity}
      </p>
      <p>
        <strong>Created At:</strong> {incident.createdAt}
      </p>
      <p>
        <strong>Updated At:</strong> {incident.updatedAt}
      </p>
    </div>
  );
};

export default IncidentDetails;
