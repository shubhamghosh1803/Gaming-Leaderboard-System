import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { platformsApi } from '../api/platformsApi';

export function Platforms() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await platformsApi.getAll();
        setPlatforms(data);
      } catch (err) {
        console.error('Failed to load platforms:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns = [
    {
      header: 'Platform ID (Pla_ID)',
      accessor: 'Pla_ID',
      width: '100px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.Pla_ID}</strong>
    },
    {
      header: 'Platform Name (Name)',
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
      header: 'Release Year (Release_y)',
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
          <p>Supported hardware platforms, operating systems, and console architectures (Platform Relation)</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={platforms}
        loading={loading}
        emptyMessage="No platforms recorded."
      />
    </div>
  );
}
