import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';
import './styles/FlowchartPage.css';

// Custom Node Components
const StartNode = ({ data }) => {
  const navigate = useNavigate();
  const isClickable = !!data.chapter;
  
  return (
    <div 
      className={`flowchart-node node-start ${isClickable ? 'clickable' : ''}`}
      onClick={() => isClickable && navigate(data.chapter)}
      title={isClickable ? `Click to open: ${data.label}` : ''}
    >
      <div className="node-icon">🚀</div>
      <div className="node-label">{data.label}</div>
      {isClickable && <div className="click-hint">Click to navigate →</div>}
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};

const EndNode = ({ data }) => {
  return (
    <div className="flowchart-node node-end">
      <div className="node-icon">🎯</div>
      <div className="node-label">{data.label}</div>
      <Handle type="target" position={Position.Top} className="handle" />
    </div>
  );
};

const DecisionNode = ({ data }) => {
  const navigate = useNavigate();
  const isClickable = !!data.chapter;
  
  return (
    <div 
      className={`flowchart-node node-decision ${isClickable ? 'clickable' : ''}`}
      onClick={() => isClickable && navigate(data.chapter)}
      title={isClickable ? `Click to open: ${data.label}` : ''}
    >
      <div className="node-icon">❓</div>
      <div className="node-label">{data.label}</div>
      {isClickable && <div className="click-hint">Click to navigate →</div>}
      <Handle type="target" position={Position.Top} className="handle" />
      <Handle type="source" position={Position.Bottom} className="handle" />
      <Handle type="source" position={Position.Left} id="left" className="handle" />
      <Handle type="source" position={Position.Right} id="right" className="handle" />
    </div>
  );
};

const StrategyNode = ({ data }) => {
  const navigate = useNavigate();
  const isClickable = !!data.chapter;
  
  return (
    <div 
      className={`flowchart-node node-strategy ${isClickable ? 'clickable' : ''}`}
      onClick={() => isClickable && navigate(data.chapter)}
      title={isClickable ? `Click to open: ${data.label}` : ''}
    >
      <div className="node-icon">{data.icon || '🔷'}</div>
      <div className="node-label">{data.label}</div>
      {isClickable && <div className="click-hint">Click to navigate →</div>}
      <Handle type="target" position={Position.Top} className="handle" />
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};

const ProcessNode = ({ data }) => {
  const navigate = useNavigate();
  const isClickable = !!data.chapter;
  
  return (
    <div 
      className={`flowchart-node node-process ${isClickable ? 'clickable' : ''}`}
      onClick={() => isClickable && navigate(data.chapter)}
      title={isClickable ? `Click to open: ${data.label}` : ''}
    >
      <div className="node-icon">{data.icon || '⚙️'}</div>
      <div className="node-label">{data.label}</div>
      {isClickable && <div className="click-hint">Click to navigate →</div>}
      <Handle type="target" position={Position.Top} className="handle" />
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};

const IterateNode = ({ data }) => {
  return (
    <div className="flowchart-node node-iterate">
      <div className="node-icon">🔄</div>
      <div className="node-label">{data.label}</div>
      <Handle type="target" position={Position.Top} className="handle" />
      <Handle type="source" position={Position.Top} id="loop" className="handle" />
    </div>
  );
};

// Node types registry
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  decision: DecisionNode,
  strategy: StrategyNode,
  process: ProcessNode,
  iterate: IterateNode,
};

// Initial nodes configuration
const initialNodes = [
  // Start
  {
    id: 'start',
    type: 'start',
    position: { x: 400, y: 0 },
    data: { label: 'Define Your Multilingual Task', chapter: '/playbook/00-introduction' },
  },
  
  // Evaluation Phase
  {
    id: 'eval',
    type: 'process',
    position: { x: 400, y: 120 },
    data: { label: 'Evaluation Strategy', icon: '📊', chapter: '/playbook/01-evaluation-overview' },
  },
  {
    id: 'eval-data',
    type: 'decision',
    position: { x: 400, y: 240 },
    data: { label: 'Do you have evaluation data?' },
  },
  {
    id: 'synthetic-data',
    type: 'process',
    position: { x: 150, y: 360 },
    data: { label: 'Create Synthetic Dataset', icon: '🧪', chapter: '/playbook/06-synthetic-data-overview' },
  },
  {
    id: 'eval-protocol',
    type: 'process',
    position: { x: 400, y: 480 },
    data: { label: 'Run Evaluation Protocol', icon: '✅', chapter: '/playbook/01-evaluation-overview' },
  },
  
  // Strategy Selection
  {
    id: 'strategy',
    type: 'decision',
    position: { x: 400, y: 600 },
    data: { label: 'Choose Core Strategy' },
  },
  
  // Translation Strategy
  {
    id: 'translation',
    type: 'strategy',
    position: { x: 50, y: 740 },
    data: { label: 'Translation Strategy', icon: '🌐', chapter: '/playbook/02-translation-overview' },
  },
  {
    id: 'mt-quality',
    type: 'process',
    position: { x: 50, y: 860 },
    data: { label: 'Check MT Quality', icon: '🔍', chapter: '/playbook/02-translation-overview' },
  },
  {
    id: 'cultural-loss',
    type: 'process',
    position: { x: 50, y: 980 },
    data: { label: 'Assess Cultural Loss Risk', icon: '🎭', chapter: '/playbook/02-v-cultural-nuance' },
  },
  
  // Fine-tuning Strategy
  {
    id: 'fine-tune',
    type: 'strategy',
    position: { x: 400, y: 740 },
    data: { label: 'Fine-Tune Model', icon: '🔧', chapter: '/playbook/04-fine-tuning-overview' },
  },
  {
    id: 'data-collection',
    type: 'process',
    position: { x: 400, y: 860 },
    data: { label: 'Collect Multilingual Data', icon: '📚', chapter: '/playbook/04-iii-data-engineering' },
  },
  {
    id: 'peft',
    type: 'process',
    position: { x: 400, y: 980 },
    data: { label: 'Apply PEFT Techniques', icon: '⚡', chapter: '/playbook/04-ii-methodologies' },
  },
  {
    id: 'cultural-align',
    type: 'process',
    position: { x: 400, y: 1100 },
    data: { label: 'Align with Cultural Values', icon: '🤝', chapter: '/playbook/07-culture-overview' },
  },
  
  // Off-the-Shelf Strategy
  {
    id: 'off-shelf',
    type: 'strategy',
    position: { x: 750, y: 740 },
    data: { label: 'Off-the-Shelf Prompting', icon: '💬', chapter: '/playbook/02-translation-overview' },
  },
  {
    id: 'prompt-design',
    type: 'process',
    position: { x: 750, y: 860 },
    data: { label: 'Design Multilingual Prompts', icon: '✏️', chapter: '/playbook/07-iv-prompt-engineering' },
  },
  {
    id: 'prompt-sensitivity',
    type: 'process',
    position: { x: 750, y: 980 },
    data: { label: 'Test Prompt Sensitivity', icon: '🧪', chapter: '/playbook/01-i-methodologies' },
  },
  
  // Safety and Deployment
  {
    id: 'safety',
    type: 'process',
    position: { x: 400, y: 1240 },
    data: { label: 'Safety Assessment', icon: '🛡️', chapter: '/playbook/05-safety-overview' },
  },
  {
    id: 'safety-check',
    type: 'decision',
    position: { x: 400, y: 1360 },
    data: { label: 'Multilingual Safety Validation', chapter: '/playbook/05-safety-overview' },
  },
  {
    id: 'deploy',
    type: 'end',
    position: { x: 400, y: 1500 },
    data: { label: 'Deploy & Monitor' },
  },
  {
    id: 'iterate',
    type: 'iterate',
    position: { x: 700, y: 1360 },
    data: { label: 'Refine & Iterate' },
  },
];

// Initial edges configuration
const initialEdges = [
  // Start flow
  { id: 'e-start-eval', source: 'start', target: 'eval', animated: true },
  { id: 'e-eval-data', source: 'eval', target: 'eval-data' },
  
  // Evaluation data decision
  { id: 'e-data-synthetic', source: 'eval-data', target: 'synthetic-data', sourceHandle: 'left', label: 'No' },
  { id: 'e-data-protocol', source: 'eval-data', target: 'eval-protocol', label: 'Yes' },
  { id: 'e-synthetic-protocol', source: 'synthetic-data', target: 'eval-protocol' },
  
  // Strategy selection
  { id: 'e-protocol-strategy', source: 'eval-protocol', target: 'strategy' },
  { id: 'e-strategy-translation', source: 'strategy', target: 'translation', sourceHandle: 'left' },
  { id: 'e-strategy-finetune', source: 'strategy', target: 'fine-tune' },
  { id: 'e-strategy-offshelf', source: 'strategy', target: 'off-shelf', sourceHandle: 'right' },
  
  // Translation path
  { id: 'e-translation-mt', source: 'translation', target: 'mt-quality' },
  { id: 'e-mt-cultural', source: 'mt-quality', target: 'cultural-loss' },
  { id: 'e-cultural-safety', source: 'cultural-loss', target: 'safety' },
  
  // Fine-tuning path
  { id: 'e-finetune-data', source: 'fine-tune', target: 'data-collection' },
  { id: 'e-data-peft', source: 'data-collection', target: 'peft' },
  { id: 'e-peft-align', source: 'peft', target: 'cultural-align' },
  { id: 'e-align-safety', source: 'cultural-align', target: 'safety' },
  
  // Off-the-shelf path
  { id: 'e-offshelf-prompt', source: 'off-shelf', target: 'prompt-design' },
  { id: 'e-prompt-sensitivity', source: 'prompt-design', target: 'prompt-sensitivity' },
  { id: 'e-sensitivity-safety', source: 'prompt-sensitivity', target: 'safety' },
  
  // Safety and deployment
  { id: 'e-safety-check', source: 'safety', target: 'safety-check' },
  { id: 'e-check-deploy', source: 'safety-check', target: 'deploy', label: 'Pass ✓' },
  { id: 'e-check-iterate', source: 'safety-check', target: 'iterate', sourceHandle: 'right', label: 'Fail ✗' },
  { id: 'e-iterate-strategy', source: 'iterate', target: 'strategy', sourceHandle: 'loop', type: 'smoothstep', style: { stroke: '#f59e0b', strokeDasharray: '5 5' } },
];

// Default edge options
const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#64748b',
  },
  style: {
    strokeWidth: 2,
    stroke: '#64748b',
  },
  labelStyle: {
    fill: '#64748b',
    fontWeight: 600,
    fontSize: 12,
  },
  labelBgStyle: {
    fill: '#f8fafc',
    fillOpacity: 0.9,
  },
  labelBgPadding: [8, 4],
  labelBgBorderRadius: 4,
};

export default function FlowchartPage() {
  const { colors } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onInit = useCallback((reactFlowInstance) => {
    reactFlowInstance.fitView({ padding: 0.1 });
  }, []);

  // Mini map node color
  const nodeColor = useCallback((node) => {
    switch (node.type) {
      case 'start':
        return '#10b981';
      case 'end':
        return '#ef4444';
      case 'decision':
        return '#f59e0b';
      case 'strategy':
        return colors.headerBg || '#312A9A';
      case 'process':
        return '#06b6d4';
      case 'iterate':
        return '#8b5cf6';
      default:
        return '#64748b';
    }
  }, [colors]);

  return (
    <div className="flowchart-page">
      <div className="flowchart-header">
        <h1>🗺️ Vibhasha Interactive Flowchart</h1>
        <p className="flowchart-subtitle">
          Navigate through the multilingual LLM playbook by clicking on any node
        </p>
      </div>
      
      <div className="flowchart-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Controls 
            showInteractive={false}
            className="flowchart-controls"
          />
          <MiniMap 
            nodeColor={nodeColor}
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="flowchart-minimap"
          />
          <Background variant="dots" gap={20} size={1} color="#e2e8f0" />
        </ReactFlow>
      </div>

      <div className="flowchart-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color start"></span>
            <span>Start Point</span>
          </div>
          <div className="legend-item">
            <span className="legend-color decision"></span>
            <span>Decision Point</span>
          </div>
          <div className="legend-item">
            <span className="legend-color strategy"></span>
            <span>Core Strategy</span>
          </div>
          <div className="legend-item">
            <span className="legend-color process"></span>
            <span>Process Step</span>
          </div>
          <div className="legend-item">
            <span className="legend-color iterate"></span>
            <span>Iteration Loop</span>
          </div>
          <div className="legend-item">
            <span className="legend-color end"></span>
            <span>End Goal</span>
          </div>
        </div>
      </div>

      <div className="flowchart-instructions">
        <div className="instruction-card">
          <span className="instruction-icon">🖱️</span>
          <span><strong>Click</strong> nodes to navigate</span>
        </div>
        <div className="instruction-card">
          <span className="instruction-icon">🔍</span>
          <span><strong>Scroll</strong> to zoom</span>
        </div>
        <div className="instruction-card">
          <span className="instruction-icon">✋</span>
          <span><strong>Drag</strong> to pan</span>
        </div>
        <div className="instruction-card">
          <span className="instruction-icon">📍</span>
          <span>Use <strong>MiniMap</strong> for overview</span>
        </div>
      </div>
    </div>
  );
}
