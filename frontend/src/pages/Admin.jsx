import React, { useEffect, useState } from "react";
import adminApi from "../api/adminApi";

export default function Admin() {
  const [status, setStatus] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const [s, h] = await Promise.all([
        adminApi.getKafkaStatus(),
        adminApi.getHealth(),
      ]);
      setStatus(s.data);
      setHealth(h.data);
    } catch (e) {
      setErr("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (enable) => {
    try {
      setToggling(true);
      setErr("");
      if (enable) await adminApi.enableIngestion();
      else await adminApi.disableIngestion();
      await load();
    } catch (e) {
      setErr("Failed to toggle ingestion");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="main-content fade-in">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Admin Controls</h2>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {err && <div className="alert alert-error">{err}</div>}
            <div className="grid">
              <div className="card">
                <h3 className="card-title">Kafka Ingestion</h3>
                <p className="mt-sm">Auto-create incidents from critical logs.</p>
                <p className="mt-sm"><b>Status:</b> {status?.autoCreateEnabled ? "Enabled" : "Disabled"}</p>
                <p className="mt-sm"><b>Topic:</b> it-logs</p>
                <p className="mt-sm"><b>Include Pattern:</b> {status?.includePattern}</p>
                <p className="mt-sm"><b>Allowed Sources:</b> {status?.allowedSources}</p>
                <p className="mt-sm"><b>Dedupe Window:</b> {status?.dedupeWindowMs} ms</p>
                <div className="mt-md">
                  {status?.autoCreateEnabled ? (
                    <button className="btn btn-danger" disabled={toggling} onClick={() => toggle(false)}>
                      {toggling ? "Disabling..." : "Disable"}
                    </button>
                  ) : (
                    <button className="btn btn-success" disabled={toggling} onClick={() => toggle(true)}>
                      {toggling ? "Enabling..." : "Enable"}
                    </button>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">Health / Metrics</h3>
                <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(health, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
