import React from 'react';
import { Gift, Calendar, UserCheck } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { initialRewards, initialAccounts } from '../data/mockData';

export function Rewards() {
  const enrichedRewards = initialRewards.map(r => {
    const acc = initialAccounts.find(a => a.Acc_ID === r.Acc_ID);
    return {
      ...r,
      account_email: acc ? acc.Email : `Account #${r.Acc_ID}`
    };
  });

  const columns = [
    {
      header: 'Reward ID',
      accessor: 'Reward_ID',
      width: '90px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.Reward_ID}</strong>
    },
    {
      header: 'Reward Type / Item',
      accessor: 'R_Type',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Gift size={15} style={{ color: 'var(--accent-emerald)' }} />
          <strong style={{ color: '#fff' }}>{row.R_Type}</strong>
        </div>
      )
    },
    {
      header: 'Claim Expiry Date',
      accessor: 'ExpiryDate',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <Calendar size={13} />
          <span>{row.ExpiryDate}</span>
        </div>
      )
    },
    {
      header: 'Recipient Account',
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
          <p>Exclusive player rewards, cosmetic unlocks, seasonal credits, and claim dates</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enrichedRewards}
        loading={false}
        emptyMessage="No rewards currently active."
      />
    </div>
  );
}
