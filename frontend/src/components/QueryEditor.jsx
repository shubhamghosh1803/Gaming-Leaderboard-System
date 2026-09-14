import React from 'react';
import { Play, RotateCcw, Terminal, Command } from 'lucide-react';
import { PRESET_QUERIES } from '../data/schemaDefinitions';

export function QueryEditor({ query, setQuery, onExecute, onClear, loading }) {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div className="sql-console-container">
      <div className="sql-editor-header">
        <div className="sql-title">
          <Terminal size={17} style={{ color: 'var(--accent-cyan)' }} />
          <span>Interactive Query Editor</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClear} 
            disabled={loading || !query}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} />
            Clear
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onExecute} 
            disabled={loading || !query.trim()}
            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
          >
            <Play size={14} />
            {loading ? 'Running...' : 'Execute Query'}
          </button>
        </div>
      </div>

      <textarea
        className="sql-textarea"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter SQL statement (e.g. SELECT * FROM Player; or JOIN queries)..."
        spellCheck="false"
      />

      <div className="sql-editor-footer">
        <div className="query-presets-bar">
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Query Presets:
          </span>
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-chip"
              onClick={() => setQuery(preset.sql)}
              title={preset.sql}
            >
              {preset.title}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
          <Command size={12} />
          <span>Press <strong>Ctrl + Enter</strong> to execute</span>
        </div>
      </div>
    </div>
  );
}
