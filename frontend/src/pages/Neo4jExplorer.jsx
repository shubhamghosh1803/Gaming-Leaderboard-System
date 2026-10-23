import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Activity, RefreshCw, RotateCw, Search } from 'lucide-react';

const NEO4J_API_BASE_URL = (
  import.meta.env.VITE_NEO4J_API_BASE_URL || 'http://127.0.0.1:8001'
).replace(/\/+$/, '');

const NODE_COLORS = {
  PGAccount: '#60a5fa',
  PGAchievement: '#f472b6',
  PGCountry: '#34d399',
  PGEmail: '#a78bfa',
  PGGame: '#fb923c',
  PGLeaderboard: '#facc15',
  PGMatch: '#f87171',
  PGPlayer: '#22d3ee',
  PGPlatform: '#c084fc',
  PGReward: '#4ade80',
  PGRewardType: '#2dd4bf',
  PGTeam: '#818cf8'
};

async function neo4jRequest(path, options) {
  const response = await fetch(`${NEO4J_API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || `Request failed with status ${response.status}`);
  }

  return data;
}

function nodeTitle(node) {
  const properties = node.properties || {};
  return (
    properties.team_name ||
    properties.name ||
    properties.first_name && `${properties.first_name} ${properties.last_name || ''}`.trim() ||
    properties.email ||
    properties.rtype ||
    properties.country_name ||
    properties.code ||
    node.labels.find(label => label.startsWith('PG')) ||
    'Graph node'
  );
}

function nodeColor(node) {
  const type = node.labels.find(label => label.startsWith('PG'));
  return NODE_COLORS[type] || '#94a3b8';
}

export function Neo4jExplorer() {
  const graphContainer = useRef(null);
  const graphRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 560 });
  const [summary, setSummary] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], relationships: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const element = graphContainer.current;
    if (!element) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setDimensions({
        width: Math.floor(entry.contentRect.width),
        height: Math.max(420, Math.floor(entry.contentRect.height))
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const loadGraph = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [nextSummary, nextGraph] = await Promise.all([
        neo4jRequest('/neo4j/summary'),
        neo4jRequest('/neo4j/graph')
      ]);
      setSummary(nextSummary);
      setGraph(nextGraph);
      setSelectedNode(current => (
        current ? nextGraph.nodes.find(node => node.id === current.id) || null : null
      ));
    } catch (requestError) {
      setError(requestError.message || 'Could not load the Neo4j graph.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const nodeTypes = useMemo(
    () => [...new Set(graph.nodes.flatMap(node => node.labels.filter(label => label.startsWith('PG'))))].sort(),
    [graph.nodes]
  );

  const graphData = useMemo(() => {
    const query = search.trim().toLowerCase();
    let focusNodes = graph.nodes;

    if (selectedType !== 'all') {
      focusNodes = focusNodes.filter(node => node.labels.includes(selectedType));
    }

    if (query) {
      focusNodes = focusNodes.filter(node => (
        `${node.labels.join(' ')} ${JSON.stringify(node.properties)}`.toLowerCase().includes(query)
      ));
    }

    const visibleIds = new Set(focusNodes.map(node => node.id));
    if (query || selectedType !== 'all') {
      graph.relationships.forEach(relationship => {
        if (visibleIds.has(relationship.source)) visibleIds.add(relationship.target);
        if (visibleIds.has(relationship.target)) visibleIds.add(relationship.source);
      });
    } else {
      graph.nodes.forEach(node => visibleIds.add(node.id));
    }

    const nodes = graph.nodes.filter(node => visibleIds.has(node.id));
    const ids = new Set(nodes.map(node => node.id));
    const links = graph.relationships
      .filter(relationship => ids.has(relationship.source) && ids.has(relationship.target))
      .map(relationship => ({
        ...relationship,
        source: relationship.source,
        target: relationship.target
      }));

    return { nodes, links };
  }, [graph, search, selectedType]);

  const handleSync = async () => {
    setSyncing(true);
    setNotice('');
    setError('');
    try {
      const result = await neo4jRequest('/neo4j/sync', { method: 'POST' });
      await loadGraph();
      setNotice(`PostgreSQL mirror refreshed: ${result.nodes} nodes and ${result.relationships} relationships.`);
    } catch (requestError) {
      setError(requestError.message || 'Could not sync PostgreSQL data to Neo4j.');
    } finally {
      setSyncing(false);
    }
  };

  const handleNodeClick = node => {
    setSelectedNode(node);
    graphRef.current?.centerAt(node.x, node.y, 500);
    graphRef.current?.zoom(2, 500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Neo4j Graph Explorer</h2>
          <p>Explore PostgreSQL data mirrored as connected graph entities.</p>
        </div>
        <div className="neo4j-actions">
          <button className="btn btn-secondary" onClick={loadGraph} disabled={loading || syncing}>
            <RefreshCw size={15} /> Refresh graph
          </button>
          <button className="btn btn-primary" onClick={handleSync} disabled={loading || syncing}>
            <RotateCw size={15} className={syncing ? 'neo4j-spinning' : ''} />
            {syncing ? 'Syncing...' : 'Sync from PostgreSQL'}
          </button>
        </div>
      </div>

      {error && <div className="alert-banner alert-error">{error}</div>}
      {notice && <div className="alert-banner alert-success">{notice}</div>}

      <div className="neo4j-summary">
        <div className="neo4j-stat-card">
          <span>PostgreSQL nodes</span>
          <strong>{summary?.nodes ?? 0}</strong>
        </div>
        <div className="neo4j-stat-card">
          <span>Relationships</span>
          <strong>{summary?.relationships ?? 0}</strong>
        </div>
        <div className="neo4j-stat-card">
          <span>Visible in graph</span>
          <strong>{graphData.nodes.length} nodes / {graphData.links.length} links</strong>
        </div>
      </div>

      <section className="neo4j-explorer-card">
        <div className="neo4j-toolbar">
          <label className="neo4j-search">
            <Search size={16} />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search names, IDs, labels..."
              aria-label="Search graph nodes"
            />
          </label>
          <select
            className="form-select neo4j-type-filter"
            value={selectedType}
            onChange={event => setSelectedType(event.target.value)}
            aria-label="Filter graph by entity type"
          >
            <option value="all">All entity types</option>
            {nodeTypes.map(type => (
              <option key={type} value={type}>{type.replace(/^PG/, '')}</option>
            ))}
          </select>
          <span className="neo4j-hint">Scroll to zoom · drag to pan · click a node for details</span>
        </div>

        <div className="neo4j-graph-layout">
          <div className="neo4j-graph-canvas" ref={graphContainer}>
            {loading && <div className="neo4j-overlay">Loading graph...</div>}
            {!loading && graphData.nodes.length === 0 && (
              <div className="neo4j-overlay">No graph nodes match this search.</div>
            )}
            {dimensions.width > 0 && (
              <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}
                backgroundColor="#0a0f19"
                nodeId="id"
                nodeRelSize={6}
                linkColor={() => 'rgba(148, 163, 184, 0.48)'}
                linkDirectionalArrowLength={3}
                linkDirectionalArrowRelPos={1}
                linkLabel={link => link.type}
                onNodeClick={handleNodeClick}
                nodeCanvasObject={(node, context, scale) => {
                  const radius = selectedNode?.id === node.id ? 8 : 5;
                  context.beginPath();
                  context.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                  context.fillStyle = nodeColor(node);
                  context.fill();
                  context.strokeStyle = selectedNode?.id === node.id ? '#fff' : '#0a0f19';
                  context.lineWidth = selectedNode?.id === node.id ? 2 : 1;
                  context.stroke();

                  if (scale > 0.75) {
                    const label = nodeTitle(node);
                    context.font = `${Math.max(3, 11 / scale)}px Inter, sans-serif`;
                    context.textAlign = 'center';
                    context.textBaseline = 'top';
                    context.fillStyle = '#e2e8f0';
                    context.fillText(label, node.x, node.y + radius + 2);
                  }
                }}
              />
            )}
          </div>

          <aside className="neo4j-details">
            <h3><Activity size={16} /> Selected entity</h3>
            {selectedNode ? (
              <>
                <span className="neo4j-entity-type">{selectedNode.labels.filter(label => label !== 'PostgresMirror').join(' · ')}</span>
                <strong className="neo4j-entity-title">{nodeTitle(selectedNode)}</strong>
                <dl>
                  {Object.entries(selectedNode.properties || {}).map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value == null ? '—' : String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="neo4j-empty-detail">Select a node in the graph to inspect its properties.</p>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Neo4jExplorer;
