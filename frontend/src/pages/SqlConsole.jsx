import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { QueryEditor } from '../components/QueryEditor';
import { QueryResultTable } from '../components/QueryResultTable';
import { queryApi } from '../api/queryApi';

export function SqlConsole() {
  const [query, setQuery] = useState('SELECT * FROM Player;');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await queryApi.execute(query);
      setResult(res);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during query execution.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>SQL Console</h2>
          <p>Run SQL queries and explore database results.</p>
        </div>
      </div>

      {/* Interactive SQL Editor */}
      <QueryEditor
        query={query}
        setQuery={setQuery}
        onExecute={handleExecute}
        onClear={handleClear}
        loading={loading}
      />

      {/* Dynamic Results Table */}
      <QueryResultTable
        result={result}
        loading={loading}
        error={error}
      />
    </div>
  );
}
