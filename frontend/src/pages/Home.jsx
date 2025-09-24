import React, { useState, useEffect } from "react";
import { getAllIncidents } from "../api/incidentApi";
import { subscribeToIncidentUpdates } from "../utils/realtime";
import IncidentList from "../components/IncidentList";

export default function Home() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = () => {
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

    fetchAll();

    const unsubscribe = subscribeToIncidentUpdates(() => {
      fetchAll();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status?.toLowerCase() === 'open').length,
    inProgress: incidents.filter(i => i.status?.toLowerCase() === 'in progress').length,
    resolved: incidents.filter(i => i.status?.toLowerCase() === 'resolved').length,
    high: incidents.filter(i => i.severity?.toLowerCase() === 'high').length,
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
      {/* Welcome Section */}
      <div className="card mb-lg">
        <div className="card-header">
          <h1 className="card-title">🏠 Welcome to Incident Management</h1>
        </div>
        <p className="text-secondary">
          Monitor, track, and resolve IT incidents efficiently with our comprehensive management system.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📊 Total Incidents</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <p className="text-muted">All incidents</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔴 Open</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-danger">{stats.open}</div>
            <p className="text-muted">Need attention</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🟡 In Progress</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{stats.inProgress}</div>
            <p className="text-muted">Being worked on</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🟢 Resolved</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{stats.resolved}</div>
            <p className="text-muted">Completed</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">⚠️ High Priority</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-danger">{stats.high}</div>
            <p className="text-muted">Urgent issues</p>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="card mt-lg">
        <div className="card-header">
          <h2 className="card-title">📋 Recent Incidents</h2>
        </div>
        <IncidentList />
      </div>
    </div>
  );
}
