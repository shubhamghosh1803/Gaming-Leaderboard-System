
import React, { useEffect, useState } from 'react';

export function Neo4jExplorer() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8001/neo4j/summary')
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || 'Could not fetch Neo4j graph summary'
          );
        }

        return data;
      })
      .then((data) => setSummary(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="neo4j-explorer">
      <h2>Neo4j Graph Explorer</h2>
      <p>
        Explore the relationships between players, teams, games and leaderboards.
      </p>

      {loading && <p>Loading graph data...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {summary && (
        <div>
          <p>Graph Nodes: {summary.nodes ?? 0}</p>
          <p>Graph Relationships: {summary.relationships ?? 0}</p>
        </div>
      )}
    </div>
  );
}

export default Neo4jExplorer;
