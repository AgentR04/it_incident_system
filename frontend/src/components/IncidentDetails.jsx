import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getIncidentById } from "../api/incidentApi";

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getIncidentById(id)
        .then((res) => {
          setIncident(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching incident:", err);
          setError("Failed to load incident details");
          setLoading(false);
        });
    }
  }, [id]);

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
      month: 'long',
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

  if (error || !incident) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h3>Incident Not Found</h3>
        <p>{error || "The incident you're looking for doesn't exist."}</p>
        <Link to="/" className="btn btn-primary mt-md">
          🏠 Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="card-title">📋 Incident Details</h1>
              <p className="text-muted">View detailed information about this incident</p>
            </div>
            <div className="incident-actions">
              <Link
                to={`/edit/${incident.id}`}
                className="btn btn-primary"
                style={{ marginRight: '0.5rem' }}
              >
                ✏️ Edit
              </Link>
              <button
                onClick={() => navigate("/")}
                className="btn btn-secondary"
              >
                🏠 Back
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Title Section */}
          <div>
            <h2 className="incident-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              {incident.title}
            </h2>
            <div className="incident-meta" style={{ marginBottom: '1.5rem' }}>
              <span className={`status-badge ${getStatusClass(incident.status)}`}>
                {incident.status}
              </span>
              <span className={`severity-badge ${getSeverityClass(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              📄 Description
            </h3>
            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                {incident.description || 'No description provided for this incident.'}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="card">
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                📅 Created
              </h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {formatDate(incident.createdAt)}
              </p>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                🔄 Last Updated
              </h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {formatDate(incident.updatedAt)}
              </p>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                🆔 Incident ID
              </h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                #{incident.id}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📊 Status Information
            </h3>
            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Current Status:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span className={`status-badge ${getStatusClass(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
                <div>
                  <strong>Severity Level:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span className={`severity-badge ${getSeverityClass(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
