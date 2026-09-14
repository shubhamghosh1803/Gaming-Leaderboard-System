import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Hash, Database } from 'lucide-react';

export function QueryResultTable({ result, loading, error }) {
  if (loading) {
    return (
      <div className="card-table-wrapper">
        <div className="empty-state">
          <div className="spinner" style={{ width: 32, height: 32 }}></div>
          <p style={{ marginTop: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Executing query...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-table-wrapper" style={{ borderColor: 'rgba(244, 63, 94, 0.35)' }}>
        <div style={{ padding: '1.25rem', background: 'rgba(244, 63, 94, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)', fontWeight: 600, fontSize: '0.9rem' }}>
            <AlertCircle size={18} />
            <span>Execution Error</span>
          </div>
          <p style={{ marginTop: '0.4rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card-table-wrapper">
        <div className="empty-state">
          <Database size={36} className="empty-icon" />
          <p style={{ fontWeight: 500, fontSize: '0.92rem' }}>No Query Executed</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
            Type a query or select a preset, then click Execute Query.
          </p>
        </div>
      </div>
    );
  }

  const { columns = [], rows = [], executionTimeMs = 0, rowCount = 0 } = result;

  return (
    <div className="card-table-wrapper">
      <div className="table-toolbar" style={{ background: 'rgba(8, 12, 20, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-emerald)', fontSize: '0.82rem', fontWeight: 600 }}>
          <CheckCircle2 size={15} />
          <span>Query executed</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Hash size={13} />
            <span><strong>{rowCount}</strong> {rowCount === 1 ? 'row' : 'rows'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={13} />
            <span><strong>{executionTimeMs}</strong> ms</span>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '0.85rem' }}>Empty result set (0 rows returned).</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} style={{ fontFamily: typeof row[col] === 'number' ? 'var(--font-mono)' : 'inherit' }}>
                      {row[col] === null || row[col] === undefined ? (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>NULL</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
