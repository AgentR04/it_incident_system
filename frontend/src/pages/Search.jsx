import React, { useState } from "react";
import incidentApi from "../api/incidentApi";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await api.get(`/search?keyword=${keyword}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div>
      <h2>Search Incidents</h2>
      <input
        type="text"
        placeholder="Enter keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((incident) => (
          <li key={incident.id}>
            {incident.title} - {incident.status} ({incident.severity})
          </li>
        ))}
      </ul>
    </div>
  );
}
