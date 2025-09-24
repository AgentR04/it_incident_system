import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createIncident, getIncidentById, updateIncident } from "../api/incidentApi";

const IncidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [incident, setIncident] = useState({
    title: "",
    description: "",
    status: "Open",
    severity: "Low",
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getIncidentById(id)
        .then((res) => {
          setIncident(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching incident:", err);
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setIncident({ ...incident, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isEditing) {
        await updateIncident(id, incident);
        alert("✅ Incident updated successfully!");
      } else {
        await createIncident(incident);
        alert("✅ Incident created successfully!");
        setIncident({ title: "", description: "", status: "Open", severity: "Low" });
      }
      navigate("/");
    } catch (err) {
      console.error("Error saving incident:", err);
      alert(`❌ Failed to ${isEditing ? 'update' : 'create'} incident`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            {isEditing ? "✏️ Edit Incident" : "➕ Create New Incident"}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              📝 Incident Title *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-input"
              placeholder="Enter incident title..."
              value={incident.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              📄 Description *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Describe the incident in detail..."
              value={incident.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">
              🔄 Status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={incident.status}
              onChange={handleChange}
            >
              <option value="Open">🔴 Open</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Resolved">🟢 Resolved</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="severity">
              ⚠️ Severity
            </label>
            <select
              id="severity"
              name="severity"
              className="form-select"
              value={incident.severity}
              onChange={handleChange}
            >
              <option value="Low">🔵 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                ❌ Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditing ? '💾 Update Incident' : '🚀 Create Incident'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;
