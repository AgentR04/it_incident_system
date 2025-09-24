import React, { useState } from "react";
import { Link } from "react-router-dom";
import { searchIncidents } from "../api/incidentApi";

export default function Search() {
  const [searchParams, setSearchParams] = useState({
    title: "",
    status: "",
    severity: ""
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const params = {};
      if (searchParams.title) params.title = searchParams.title;
      if (searchParams.status) params.status = searchParams.status;
      if (searchParams.severity) params.severity = searchParams.severity;
      
      const res = await searchIncidents(params);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
      alert("❌ Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({ title: "", status: "", severity: "" });
    setResults([]);
    setHasSearched(false);
  };

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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
      day: 'numeric'
    });
  };

  return (
    <div className="fade-in">
      <div className="search-container">
        <div className="card-header">
          <h1 className="card-title">🔍 Search Incidents</h1>
          <p className="text-muted">Find incidents by title, status, or severity</p>
        </div>
        
        <div className="search-form">
          <div className="search-input-group">
            <label className="form-label" htmlFor="title">
              📝 Search by Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-input"
              placeholder="Enter incident title or keyword..."
              value={searchParams.title}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="search-input-group">
            <label className="form-label" htmlFor="status">
              🔄 Status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={searchParams.status}
              onChange={handleChange}
            >
              <option value="">All Statuses</option>
              <option value="Open">🔴 Open</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Resolved">🟢 Resolved</option>
            </select>
          </div>
          
          <div className="search-input-group">
            <label className="form-label" htmlFor="severity">
              ⚠️ Severity
            </label>
            <select
              id="severity"
              name="severity"
              className="form-select"
              value={searchParams.severity}
              onChange={handleChange}
            >
              <option value="">All Severities</option>
              <option value="Low">🔵 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>
          
          <div className="search-input-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                  Searching...
                </>
              ) : (
                "🔍 Search"
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              📊 Search Results ({results.length} found)
            </h2>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No Results Found</h3>
              <p>Try adjusting your search criteria or browse all incidents.</p>
              <Link to="/" className="btn btn-primary mt-md">
                🏠 View All Incidents
              </Link>
            </div>
          ) : (
            <div className="search-results">
              {results.map((incident) => (
                <div key={incident.id} className="search-result-item">
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
                  
                  <p className="incident-description" style={{ margin: '0.5rem 0' }}>
                    {incident.description || 'No description provided'}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div>📅 {formatDate(incident.createdAt)}</div>
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
                      >
                        ✏️ Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
