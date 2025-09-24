import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllIncidents, deleteIncident } from "../api/incidentApi";
import { subscribeToIncidentUpdates } from "../utils/realtime";

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = () => {
      getAllIncidents()
        .then((res) => {
          setIncidents(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching incidents:", err);
          setLoading(false);
        });
    };

    // initial load
    fetchIncidents();

    // subscribe to realtime updates
    const unsubscribe = subscribeToIncidentUpdates(() => {
      fetchIncidents();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this incident? This action cannot be undone.")) {
      deleteIncident(id)
        .then(() => {
          setIncidents(incidents.filter((i) => i.id !== id));
          alert("✅ Incident deleted successfully!");
        })
        .catch((err) => {
          console.error("Error deleting:", err);
          alert("❌ Failed to delete incident");
        });
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'status-open';
      case 'in progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      default:
        return 'status-open';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return 'severity-low';
      case 'medium':
        return 'severity-medium';
      case 'high':
        return 'severity-high';
      default:
        return 'severity-low';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3>No Incidents Found</h3>
        <p>There are no incidents in the system. Create your first incident to get started!</p>
        <Link to="/create" className="btn btn-primary mt-md">
          ➕ Create First Incident
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="incident-list">
        {incidents.map((incident) => (
          <div key={incident.id} className="incident-item fade-in">
            <div className="incident-header">
              <div>
                <h3 className="incident-title">{incident.title}</h3>
                <div className="incident-meta">
                  <span className={`status-badge ${getStatusClass(incident.status)}`}>
                    {incident.status}
                  </span>
                  <span className={`severity-badge ${getSeverityClass(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="incident-description">
              {incident.description || 'No description provided'}
            </p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: 'var(--text-muted)'
            }}>
              <div>
                <div>📅 Created: {formatDate(incident.createdAt)}</div>
                {incident.updatedAt && incident.updatedAt !== incident.createdAt && (
                  <div>🔄 Updated: {formatDate(incident.updatedAt)}</div>
                )}
              </div>
              
              <div className="incident-actions">
                <Link
                  to={`/incidents/${incident.id}`}
                  className="btn btn-secondary"
                  style={{ marginRight: '0.5rem' }}
                >
                  👁️ View
                </Link>
                <Link
                  to={`/edit/${incident.id}`}
                  className="btn btn-primary"
                  style={{ marginRight: '0.5rem' }}
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(incident.id)}
                  className="btn btn-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentList;
