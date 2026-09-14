import React, { useState, useEffect } from 'react';
import { Gift, Calendar } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { rewardsApi } from '../api/rewardsApi';

export function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await rewardsApi.getAll();
        setRewards(data);
      } catch (err) {
        console.error('Failed to load rewards:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns = [
    {
      header: 'Reward ID',
      accessor: 'Reward_ID',
      width: '90px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.Reward_ID}</strong>
    },
    {
      header: 'Reward Type / Item (R_Type)',
      accessor: 'R_Type',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Gift size={15} style={{ color: 'var(--accent-emerald)' }} />
          <strong style={{ color: '#fff' }}>{row.R_Type}</strong>
        </div>
      )
    },
    {
      header: 'Claim Expiry Date (ExpiryDate)',
      accessor: 'ExpiryDate',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <Calendar size={13} />
          <span>{row.ExpiryDate}</span>
        </div>
      )
    },
    {
      header: 'Recipient Account (Acc_ID)',
      accessor: 'account_email',
      render: (row) => (
        <span style={{ color: 'var(--accent-cyan)' }}>
          #{row.Acc_ID} • {row.account_email}
        </span>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Reward Inventory</h2>
          <p>Exclusive player rewards, cosmetic unlocks, seasonal credits, and claim dates (Reward Relation)</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rewards}
        loading={loading}
        emptyMessage="No rewards currently active."
      />
    </div>
  );
}
