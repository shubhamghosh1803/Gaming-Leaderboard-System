import React from 'react';
import { Monitor, Cpu, Calendar } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { initialPlatforms } from '../data/mockData';

export function Platforms() {
  const columns = [
    {
      header: 'Platform ID',
      accessor: 'Pla_ID',
      width: '90px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.Pla_ID}</strong>
    },
    {
      header: 'Platform Name',
      accessor: 'Name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Monitor size={15} style={{ color: 'var(--accent-cyan)' }} />
          <strong style={{ color: '#fff' }}>{row.Name}</strong>
        </div>
      )
    },
    {
      header: 'Manufacturer',
      accessor: 'Manufacturer',
      render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.Manufacturer}</span>
    },
    {
      header: 'Release Year',
      accessor: 'Release_y',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {row.Release_y}
        </span>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Gaming Platforms</h2>
          <p>Supported hardware platforms, operating systems, and console architectures</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={initialPlatforms}
        loading={false}
        emptyMessage="No platforms recorded."
      />
    </div>
  );
}
