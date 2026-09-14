import React from 'react';

export function DataTable({ columns, data, loading, emptyMessage = 'No records found.' }) {
  if (loading) {
    return (
      <div className="card-table-wrapper">
        <div className="empty-state">
          <div className="spinner" style={{ width: 32, height: 32 }}></div>
          <p style={{ marginTop: '1rem' }}>Loading records from database...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card-table-wrapper">
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-table-wrapper">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ textAlign: col.align || 'left', width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rIdx) => (
              <tr key={row.id || row.Player_ID || row.Match_ID || row.L_ID || rIdx}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row, rIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
