import React, { useCallback, useState, useRef } from 'react';
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
  BaseEdge,
  getSmoothStepPath,
  EdgeLabelRenderer,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';
import './styles/FlowchartPage.css';

/* ============================================================
   CUSTOM NODE COMPONENTS — richer, with descriptions + tooltips
   ============================================================ */
const NodeShell = ({ data, className, icon, children, hasSource = true, hasTarget = true, sourceHandles, targetHandles }) => {
  const isClickable = !!data.chapter;

  return (
    <div
      className={`fc-node ${className} ${isClickable ? 'fc-clickable' : ''}`}
    >
      {/* Default handles */}
      {hasTarget && !targetHandles && <Handle type="target" position={Position.Top} className="fc-handle" />}
      {targetHandles}

      <div className="fc-node-inner">
        <span className="fc-node-icon">{icon}</span>
        <span className="fc-node-label">{data.label}</span>
        {data.desc && <span className="fc-node-desc">{data.desc}</span>}
      </div>
      {isClickable && <span className="fc-node-badge">Open chapter →</span>}

      {hasSource && !sourceHandles && <Handle type="source" position={Position.Bottom} className="fc-handle" />}
      {sourceHandles}
      {children}
    </div>
  );
};

const StartNode = ({ data }) => (
  <NodeShell data={data} className="fc-start" icon="🚀" hasTarget={false} />
);

const EndNode = ({ data }) => (
  <NodeShell data={data} className="fc-end" icon="🎯" hasSource={false} />
);

const DecisionNode = ({ data }) => (
  <NodeShell
    data={data}
    className="fc-decision"
    icon="◆"
    sourceHandles={
      <>
        <Handle type="source" position={Position.Bottom} className="fc-handle" />
        <Handle type="source" position={Position.Left} id="left" className="fc-handle" />
        <Handle type="source" position={Position.Right} id="right" className="fc-handle" />
      </>
    }
  />
);

const StrategyNode = ({ data }) => (
  <NodeShell data={data} className="fc-strategy" icon={data.icon || '🔷'} />
);

const ProcessNode = ({ data }) => (
  <NodeShell data={data} className="fc-process" icon={data.icon || '⚙️'} />
);

const IterateNode = ({ data }) => (
  <NodeShell
    data={data}
    className="fc-iterate"
    icon="🔄"
    sourceHandles={<Handle type="source" position={Position.Top} id="loop" className="fc-handle" />}
  />
);

/* ============================================================
   CUSTOM EDGE — with styled label badges
   ============================================================ */
const StyledEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style, markerEnd, label }) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 16 });
  const cls = data?.edgeClass || '';
  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} className={cls} />
      {label && (
        <EdgeLabelRenderer>
          <div
            className={`fc-edge-label ${data?.labelClass || ''}`}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, position: 'absolute', pointerEvents: 'all' }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

/* ============================================================
   REGISTRIES
   ============================================================ */
const nodeTypes = { start: StartNode, end: EndNode, decision: DecisionNode, strategy: StrategyNode, process: ProcessNode, iterate: IterateNode };
const edgeTypes = { styled: StyledEdge };

/* ============================================================
   PHASE GROUP HELPER — coloured lane backgrounds
   ============================================================ */
const PhaseGroup = ({ data }) => (
  <div className={`fc-phase-group ${data.className || ''}`}>
    <span className="fc-phase-label">{data.label}</span>
  </div>
);

const phaseNodeTypes = { ...nodeTypes, phase: PhaseGroup };

/* ============================================================
   NODES — redesigned to match actual playbook chapters
   ============================================================ */
const initialNodes = [
  // ════════════════════════════════════════════════
  // EVALUATION FOUNDATION
  // ════════════════════════════════════════════════
  {
    id: 'start',
    type: 'start',
    position: { x: 285, y: 10 },
    data: {
      label: 'Define Your Multilingual Task',
      desc: 'Identify languages, task type & deployment goals',
      chapter: '/playbook/00-introduction',
    },
  },
  {
    id: 'eval',
    type: 'process',
    position: { x: 285, y: 130 },
    data: {
      label: 'Build Evaluation Framework',
      desc: 'English benchmarks are not enough — plan multilingual metrics',
      icon: '📊',
      chapter: '/playbook/01-evaluation',
    },
  },
  {
    id: 'eval-data',
    type: 'decision',
    position: { x: 285, y: 260 },
    data: { label: 'Have evaluation data?', desc: 'Existing benchmarks or test sets for your languages' },
  },
  {
    id: 'synthetic',
    type: 'process',
    position: { x: 60, y: 400 },
    data: {
      label: 'Generate Synthetic Data',
      desc: 'Close the data scarcity gap with LLM-generated data',
      icon: '🧪',
      chapter: '/playbook/06-synthetic-data',
    },
  },
  {
    id: 'eval-protocol',
    type: 'process',
    position: { x: 450, y: 400 },
    data: {
      label: 'Run Evaluation Protocol',
      desc: 'MCQ pipelines, human judgment & automated scoring',
      icon: '✅',
      chapter: '/playbook/01-ii-pipeline',
    },
  },

  // ════════════════════════════════════════════════
  // STRATEGIC CROSSROADS
  // ════════════════════════════════════════════════
  {
    id: 'crossroads',
    type: 'process',
    position: { x: 285, y: 620 },
    data: {
      label: 'Assess Language & Resources',
      desc: 'Language representation × model size × MT quality',
      icon: '🔀',
      chapter: '/playbook/03-i-strategic-crossroads',
    },
  },
  {
    id: 'choose',
    type: 'decision',
    position: { x: 285, y: 750 },
    data: {
      label: 'Choose Core Strategy',
      desc: 'Based on the three performance determinants',
    },
  },

  // ════════════════════════════════════════════════
  // DIRECT INFERENCE & PROMPTING (left)
  // ════════════════════════════════════════════════
  {
    id: 'direct',
    type: 'strategy',
    position: { x: -100, y: 910 },
    data: {
      label: 'Direct Inference & Prompting',
      desc: 'Prompt the LLM in the target language — best for ~85% of languages',
      icon: '💬',
      chapter: '/playbook/02-prompting',
    },
  },
  {
    id: 'model-select',
    type: 'process',
    position: { x: -100, y: 1050 },
    data: {
      label: 'Select the Right Model',
      desc: 'Check language support, leaderboards & tokenizer efficiency',
      icon: '🔍',
      chapter: '/playbook/02-ii-model-selection',
    },
  },
  {
    id: 'prompting-strategy',
    type: 'process',
    position: { x: -100, y: 1190 },
    data: {
      label: 'Choose Prompting Strategy',
      desc: 'Monolingual, cross-lingual, or translate-test prompting',
      icon: '✨',
      chapter: '/playbook/02-i-strategies',
    },
  },
  {
    id: 'few-shot-cot',
    type: 'process',
    position: { x: -100, y: 1330 },
    data: {
      label: 'Few-Shot & Chain-of-Thought',
      desc: 'Native examples + English reasoning (En-CoT) for best results',
      icon: '🧠',
      chapter: '/playbook/02-iii-few-shot',
    },
  },
  {
    id: 'prompt-eng',
    type: 'process',
    position: { x: -100, y: 1470 },
    data: {
      label: 'Cultural Prompt Engineering',
      desc: 'Structured prompts for 71–81% better cultural alignment',
      icon: '✏️',
      chapter: '/playbook/07-iv-prompt-engineering',
    },
  },
  {
    id: 'test-prompting',
    type: 'process',
    position: { x: -100, y: 1610 },
    data: {
      label: 'Test & Validate Prompts',
      desc: 'Evaluate across models, strategies & languages on representative samples',
      icon: '🧪',
      chapter: '/playbook/02-iv-evaluation',
    },
  },

  // ════════════════════════════════════════════════
  // PRE-TRANSLATION (center)
  // ════════════════════════════════════════════════
  {
    id: 'pretranslate',
    type: 'strategy',
    position: { x: 260, y: 910 },
    data: {
      label: 'Translation',
      desc: 'Full or selective translation as a bridge to English',
      icon: '🌐',
      chapter: '/playbook/03-ii-architectures',
    },
  },
  {
    id: 'adaptation',
    type: 'process',
    position: { x: 260, y: 1050 },
    data: {
      label: 'System Adaptation',
      desc: 'Glossaries, terminology injection & error mitigation',
      icon: '🔧',
      chapter: '/playbook/03-iii-adaptation',
    },
  },
  {
    id: 'trans-qa',
    type: 'process',
    position: { x: 260, y: 1190 },
    data: {
      label: 'Translation Quality Assurance',
      desc: 'Evaluate & validate translation output quality',
      icon: '🔍',
      chapter: '/playbook/03-iv-quality-assurance',
    },
  },
  {
    id: 'cultural-nuance',
    type: 'process',
    position: { x: 260, y: 1330 },
    data: {
      label: 'Assess Cultural Nuance Loss',
      desc: 'Identify meaning & tone lost across languages',
      icon: '🎭',
      chapter: '/playbook/03-v-cultural-nuance',
    },
  },

  // ════════════════════════════════════════════════
  // FINE-TUNING (right)
  // ════════════════════════════════════════════════
  {
    id: 'finetune',
    type: 'strategy',
    position: { x: 610, y: 910 },
    data: {
      label: 'Fine-Tune Model',
      desc: 'Max control for high-stakes, specialized, or on-prem use cases',
      icon: '🔧',
      chapter: '/playbook/04-fine-tuning',
    },
  },
  {
    id: 'ft-pipeline',
    type: 'process',
    position: { x: 610, y: 1050 },
    data: {
      label: 'Fine-Tuning Pipeline',
      desc: 'Linguistic priming → behavioral alignment → stability control',
      icon: '🔄',
      chapter: '/playbook/04-i-pipeline',
    },
  },
  {
    id: 'data-eng',
    type: 'process',
    position: { x: 610, y: 1190 },
    data: {
      label: 'Data Engineering',
      desc: 'Curate multilingual training corpora + synthetic augmentation',
      icon: '📚',
      chapter: '/playbook/04-iii-data-engineering',
    },
  },
  {
    id: 'peft',
    type: 'process',
    position: { x: 610, y: 1330 },
    data: {
      label: 'PEFT Techniques',
      desc: 'LoRA, QLoRA, adapters — composable language/domain/safety modules',
      icon: '⚡',
      chapter: '/playbook/04-ii-methodologies',
    },
  },

  // ════════════════════════════════════════════════
  // SAFETY, CULTURE & DEPLOYMENT
  // ════════════════════════════════════════════════
  {
    id: 'cultural',
    type: 'process',
    position: { x: 260, y: 1830 },
    data: {
      label: 'Cultural Awareness',
      desc: 'Combat algorithmic monoculture — cultural adaptation across all strategies',
      icon: '🌍',
      chapter: '/playbook/07-culture',
    },
  },
  {
    id: 'safety',
    type: 'process',
    position: { x: 260, y: 1960 },
    data: {
      label: 'Safety Assessment',
      desc: 'Per-language testing — expect 3× higher risk in low-resource languages',
      icon: '🛡️',
      chapter: '/playbook/05-safety',
    },
  },
  {
    id: 'redteam',
    type: 'process',
    position: { x: 55, y: 2090 },
    data: {
      label: 'Red Teaming',
      desc: 'Manual + automated adversarial probing across languages',
      icon: '🎯',
      chapter: '/playbook/05-iii-red-teaming',
    },
  },
  {
    id: 'toolkits',
    type: 'process',
    position: { x: 465, y: 2090 },
    data: {
      label: 'Safety Toolkits',
      desc: 'Frameworks & tools for multilingual safety at scale',
      icon: '🧰',
      chapter: '/playbook/05-iv-toolkits',
    },
  },
  {
    id: 'safety-check',
    type: 'decision',
    position: { x: 260, y: 2230 },
    data: {
      label: 'Safety Validation',
      desc: 'Pass all multilingual safety checks?',
      chapter: '/playbook/05-i-vulnerabilities',
    },
  },
  {
    id: 'deploy',
    type: 'end',
    position: { x: 260, y: 2380 },
    data: {
      label: 'Deploy & Monitor',
      desc: 'Ship, continuously evaluate, and adapt',
    },
  },
  {
    id: 'iterate',
    type: 'iterate',
    position: { x: 565, y: 2230 },
    data: { label: 'Refine & Iterate', desc: 'Address failures, add languages, retrain' },
  },
];

/* ============================================================
   EDGES — colour-coded per strategy path
   ============================================================ */
const EDGE_COLORS = {
  primary: '#64748b',
  direct: '#2563eb',
  prompting: '#3B7DD8',
  pretranslate: '#0d9488',
  finetune: '#7c3aed',
  safety: '#dc2626',
  iterate: '#f59e0b',
  crosscut: '#64748b',
};

const initialEdges = [
  // ── Phase 1: Evaluation flow ────────────────────
  { id: 'e-start-eval', source: 'start', target: 'eval', type: 'styled', animated: true, style: { stroke: EDGE_COLORS.primary, strokeWidth: 2.5 } },
  { id: 'e-eval-data', source: 'eval', target: 'eval-data', type: 'styled', style: { stroke: EDGE_COLORS.primary, strokeWidth: 2 } },
  { id: 'e-nodata', source: 'eval-data', target: 'synthetic', sourceHandle: 'left', type: 'styled', label: 'No', data: { labelClass: 'label-no' }, style: { stroke: EDGE_COLORS.primary, strokeWidth: 2 } },
  { id: 'e-yesdata', source: 'eval-data', target: 'eval-protocol', sourceHandle: 'right', type: 'styled', label: 'Yes', data: { labelClass: 'label-yes' }, style: { stroke: EDGE_COLORS.primary, strokeWidth: 2 } },
  { id: 'e-syn-proto', source: 'synthetic', target: 'eval-protocol', type: 'styled', style: { stroke: EDGE_COLORS.primary, strokeWidth: 2, strokeDasharray: '6 4' } },

  // ── Phase 2: Strategic Crossroads ───────────────
  { id: 'e-proto-cross', source: 'eval-protocol', target: 'crossroads', type: 'styled', animated: true, style: { stroke: EDGE_COLORS.primary, strokeWidth: 2.5 } },
  { id: 'e-cross-choose', source: 'crossroads', target: 'choose', type: 'styled', style: { stroke: EDGE_COLORS.primary, strokeWidth: 2 } },

  // Strategy fan-out
  { id: 'e-choose-direct', source: 'choose', target: 'direct', sourceHandle: 'left', type: 'styled', style: { stroke: EDGE_COLORS.direct, strokeWidth: 2.5 } },
  { id: 'e-choose-pretranslate', source: 'choose', target: 'pretranslate', type: 'styled', style: { stroke: EDGE_COLORS.pretranslate, strokeWidth: 2.5 } },
  { id: 'e-choose-finetune', source: 'choose', target: 'finetune', sourceHandle: 'right', type: 'styled', style: { stroke: EDGE_COLORS.finetune, strokeWidth: 2.5 } },

  // ── Path A: Direct Inference + Prompting (blue) ─
  { id: 'e-direct-model', source: 'direct', target: 'model-select', type: 'styled', style: { stroke: EDGE_COLORS.direct, strokeWidth: 2 } },
  { id: 'e-model-strategy', source: 'model-select', target: 'prompting-strategy', type: 'styled', style: { stroke: EDGE_COLORS.prompting, strokeWidth: 2 } },
  { id: 'e-strategy-fewshot', source: 'prompting-strategy', target: 'few-shot-cot', type: 'styled', style: { stroke: EDGE_COLORS.prompting, strokeWidth: 2 } },
  { id: 'e-fewshot-prompt', source: 'few-shot-cot', target: 'prompt-eng', type: 'styled', style: { stroke: EDGE_COLORS.prompting, strokeWidth: 2 } },
  { id: 'e-prompt-test', source: 'prompt-eng', target: 'test-prompting', type: 'styled', style: { stroke: EDGE_COLORS.direct, strokeWidth: 2 } },
  { id: 'e-test-cultural', source: 'test-prompting', target: 'cultural', type: 'styled', style: { stroke: EDGE_COLORS.direct, strokeWidth: 2, strokeDasharray: '6 4' } },

  // ── Path B: Pre-Translation (teal) ──────────────
  { id: 'e-pre-adapt', source: 'pretranslate', target: 'adaptation', type: 'styled', style: { stroke: EDGE_COLORS.pretranslate, strokeWidth: 2 } },
  { id: 'e-adapt-qa', source: 'adaptation', target: 'trans-qa', type: 'styled', style: { stroke: EDGE_COLORS.pretranslate, strokeWidth: 2 } },
  { id: 'e-qa-nuance', source: 'trans-qa', target: 'cultural-nuance', type: 'styled', style: { stroke: EDGE_COLORS.pretranslate, strokeWidth: 2 } },
  { id: 'e-nuance-cultural', source: 'cultural-nuance', target: 'cultural', type: 'styled', style: { stroke: EDGE_COLORS.pretranslate, strokeWidth: 2, strokeDasharray: '6 4' } },

  // ── Path C: Fine-Tuning (purple) ────────────────
  { id: 'e-ft-pipeline', source: 'finetune', target: 'ft-pipeline', type: 'styled', style: { stroke: EDGE_COLORS.finetune, strokeWidth: 2 } },
  { id: 'e-pipe-data', source: 'ft-pipeline', target: 'data-eng', type: 'styled', style: { stroke: EDGE_COLORS.finetune, strokeWidth: 2 } },
  { id: 'e-data-peft', source: 'data-eng', target: 'peft', type: 'styled', style: { stroke: EDGE_COLORS.finetune, strokeWidth: 2 } },
  { id: 'e-peft-cultural', source: 'peft', target: 'cultural', type: 'styled', style: { stroke: EDGE_COLORS.finetune, strokeWidth: 2, strokeDasharray: '6 4' } },

  // Cross-cutting: synthetic data feeds fine-tuning data engineering
  { id: 'e-syn-data', source: 'synthetic', target: 'data-eng', type: 'styled', style: { stroke: EDGE_COLORS.crosscut, strokeWidth: 1.5, strokeDasharray: '4 4' } },

  // ── Phase 4: Safety & Deploy ────────────────────
  { id: 'e-cultural-safety', source: 'cultural', target: 'safety', type: 'styled', style: { stroke: EDGE_COLORS.safety, strokeWidth: 2.5 } },
  { id: 'e-safety-red', source: 'safety', target: 'redteam', type: 'styled', style: { stroke: EDGE_COLORS.safety, strokeWidth: 2 } },
  { id: 'e-safety-tools', source: 'safety', target: 'toolkits', type: 'styled', style: { stroke: EDGE_COLORS.safety, strokeWidth: 2 } },
  { id: 'e-red-check', source: 'redteam', target: 'safety-check', type: 'styled', style: { stroke: EDGE_COLORS.safety, strokeWidth: 2 } },
  { id: 'e-tools-check', source: 'toolkits', target: 'safety-check', type: 'styled', style: { stroke: EDGE_COLORS.safety, strokeWidth: 2 } },
  { id: 'e-check-deploy', source: 'safety-check', target: 'deploy', type: 'styled', label: 'Pass ✓', data: { labelClass: 'label-pass' }, style: { stroke: '#16a34a', strokeWidth: 2.5 } },
  { id: 'e-check-iterate', source: 'safety-check', target: 'iterate', sourceHandle: 'right', type: 'styled', label: 'Fail ✗', data: { labelClass: 'label-fail' }, style: { stroke: EDGE_COLORS.iterate, strokeWidth: 2.5 } },
  { id: 'e-iterate-choose', source: 'iterate', target: 'choose', sourceHandle: 'loop', type: 'styled', animated: true, style: { stroke: EDGE_COLORS.iterate, strokeWidth: 2.5, strokeDasharray: '8 4' } },
];

/* ============================================================
   DEFAULT EDGE OPTIONS
   ============================================================ */
const defaultEdgeOptions = {
  type: 'styled',
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#64748b' },
  style: { strokeWidth: 2, stroke: '#64748b' },
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function FlowchartPage() {
  const { colors } = useTheme();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowRef = useRef(null);

  const navigate = useNavigate();

  const onInit = useCallback((instance) => {
    reactFlowRef.current = instance;
    setTimeout(() => instance.fitView({ padding: 0.08, duration: 600 }), 100);
  }, []);

  const onNodeClick = useCallback((_event, node) => {
    if (node.data?.chapter) {
      navigate(node.data.chapter);
    }
  }, [navigate]);

  const nodeColor = useCallback((node) => {
    const map = { start: '#10b981', end: '#ef4444', decision: '#f59e0b', strategy: colors.headerBg || '#312A9A', process: '#06b6d4', iterate: '#8b5cf6', phase: 'transparent' };
    return map[node.type] || '#64748b';
  }, [colors]);

  return (
    <div className="fc-page">
      {/* ── Header ─────────────────────────────── */}
      <header className="fc-header">
        <h1 className="fc-title">Interactive Decision Flowchart</h1>
        <p className="fc-subtitle">
          Navigate the playbook visually — click any node to jump to its chapter.
          The chart covers evaluation, strategy selection, prompting, implementation, and safety validation.
        </p>

        {/* Compact inline legend */}
        <div className="fc-legend-bar">
          <span className="fc-legend-chip fc-chip-start">Start</span>
          <span className="fc-legend-chip fc-chip-decision">Decision</span>
          <span className="fc-legend-chip fc-chip-strategy">Strategy</span>
          <span className="fc-legend-chip fc-chip-process">Process</span>
          <span className="fc-legend-chip fc-chip-iterate">Iterate</span>
          <span className="fc-legend-chip fc-chip-end">End</span>
          <span className="fc-legend-sep" />
          <span className="fc-legend-hint">Scroll to zoom · Drag to pan · Click nodes to navigate</span>
        </div>
      </header>

      {/* ── Content sections (instructions first) ─ */}
      <div className="fc-content">

        <section className="fc-section">
          <h2>How the flowchart works</h2>
          <p>
            The flowchart guides you through the most important decision points for building a multilingual AI system.
            Rather than reading the entire playbook front to back, use it to identify the right strategy in minutes.
          </p>
          <div className="fc-questions">
            <div className="fc-q-item">
              <span className="fc-q-num">1</span>
              <div>
                <strong>Define your task &amp; languages</strong>
                <span>Extraction, generation, classification, dialogue, or search — and whether your target languages are high‑, mid‑, or low‑resource.</span>
              </div>
            </div>
            <div className="fc-q-item">
              <span className="fc-q-num">2</span>
              <div>
                <strong>Evaluate language representation</strong>
                <span>How well does the model support your languages? This is the single most important factor in choosing a strategy.</span>
              </div>
            </div>
            <div className="fc-q-item">
              <span className="fc-q-num">3</span>
              <div>
                <strong>Assess your resources &amp; constraints</strong>
                <span>Available training data, MT quality, timeline, cultural sensitivity needs, privacy requirements.</span>
              </div>
            </div>
            <div className="fc-q-item">
              <span className="fc-q-num">4</span>
              <div>
                <strong>Choose and implement a strategy</strong>
                <span>Direct inference with prompting, pre‑translation, or fine‑tuning — each with its own implementation path shown in the flowchart below.</span>
              </div>
            </div>
            <div className="fc-q-item">
              <span className="fc-q-num">5</span>
              <div>
                <strong>Validate safety &amp; cultural alignment</strong>
                <span>Red‑team across all target languages and validate cultural appropriateness before deploying.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="fc-section">
          <h2>Example outcomes</h2>
          <div className="fc-outcomes">
            <div className="fc-outcome-card">
              <div className="fc-outcome-tag fc-tag-direct">Direct Inference + Prompting</div>
              <h3>Mid‑resource language, fast prototype</h3>
              <p><strong>Scenario:</strong> Summarization in Spanish &amp; Portuguese, minimal data, medium cultural nuance</p>
              <p><strong>Strategy:</strong> Select a model with strong language support, use monolingual prompting with native examples and En-CoT reasoning, then validate with representative samples.</p>
            </div>
            <div className="fc-outcome-card">
              <div className="fc-outcome-tag fc-tag-pretranslate">Pre‑Translation</div>
              <h3>Low‑resource language, high cultural needs</h3>
              <p><strong>Scenario:</strong> Customer support in Amharic &amp; Oromo, limited data, strong safety constraints</p>
              <p><strong>Strategy:</strong> Selective pre‑translation with system adaptation, domain glossaries, and cultural nuance assessment. Combine with synthetic data for evaluation.</p>
            </div>
            <div className="fc-outcome-card">
              <div className="fc-outcome-tag fc-tag-finetune">Fine‑Tuning</div>
              <h3>Regulated domain, production‑grade</h3>
              <p><strong>Scenario:</strong> Medical assistance in French, Hindi &amp; Arabic, robust data, on‑prem preferred</p>
              <p><strong>Strategy:</strong> Fine‑tune with PEFT adapters (language + domain + safety modules), backed by synthetic data and rigorous red teaming across all languages.</p>
            </div>
          </div>
        </section>

        <div className="fc-two-col">
          <section className="fc-section">
            <h2>Who this helps</h2>
            <ul>
              <li><strong>Product teams</strong> scoping multilingual launches</li>
              <li><strong>Localization teams</strong> choosing where to add native content</li>
              <li><strong>Engineering teams</strong> deciding which pipeline to implement</li>
              <li><strong>Research teams</strong> planning model evaluation</li>
              <li><strong>Safety teams</strong> prioritizing languages for red‑teaming</li>
            </ul>
          </section>

          <section className="fc-section">
            <h2>When to revisit</h2>
            <ul>
              <li>Adding new languages to your system</li>
              <li>Introducing new features or task types</li>
              <li>Seeing degraded quality or safety in a region</li>
              <li>Migrating to a new model family</li>
              <li>Rethinking your multilingual architecture</li>
            </ul>
          </section>
        </div>

        <section className="fc-section fc-next-steps">
          <h2>Next steps after using the flowchart</h2>
          <div className="fc-steps-grid">
            <div className="fc-step">
              <span className="fc-step-num">1</span>
              <span>Review the recommended strategy chapter</span>
            </div>
            <div className="fc-step">
              <span className="fc-step-num">2</span>
              <span>Set up your evaluation framework</span>
            </div>
            <div className="fc-step">
              <span className="fc-step-num">3</span>
              <span>Review safety considerations for your languages</span>
            </div>
            <div className="fc-step">
              <span className="fc-step-num">4</span>
              <span>Build a small pilot in one language per tier</span>
            </div>
            <div className="fc-step">
              <span className="fc-step-num">5</span>
              <span>Expand to additional languages after QA</span>
            </div>
            <div className="fc-step">
              <span className="fc-step-num">6</span>
              <span>Plan cultural alignment &amp; data engineering if fine‑tuning</span>
            </div>
          </div>
        </section>

      </div>

      {/* ── Canvas ─────────────────────────────── */}
      <div className="fc-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          onNodeClick={onNodeClick}
          nodeTypes={phaseNodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.12}
          maxZoom={2.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          proOptions={{ hideAttribution: true }}
        >
          <Controls showInteractive={false} className="fc-controls" />
          <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable className="fc-minimap" />
          <Background variant="dots" gap={24} size={1} color="var(--fc-dot-color, #e2e8f0)" />
        </ReactFlow>
      </div>

      {/* ── Path legend (below canvas) ─────────── */}
      <div className="fc-path-legend">
        <div className="fc-path-item">
          <span className="fc-path-line" style={{ background: EDGE_COLORS.direct }} />
          <span>Direct inference path</span>
        </div>
        <div className="fc-path-item">
          <span className="fc-path-line" style={{ background: EDGE_COLORS.prompting }} />
          <span>Prompting strategy path</span>
        </div>
        <div className="fc-path-item">
          <span className="fc-path-line" style={{ background: EDGE_COLORS.pretranslate }} />
          <span>Pre-translation path</span>
        </div>
        <div className="fc-path-item">
          <span className="fc-path-line" style={{ background: EDGE_COLORS.finetune }} />
          <span>Fine-tuning path</span>
        </div>
        <div className="fc-path-item">
          <span className="fc-path-line" style={{ background: EDGE_COLORS.safety }} />
          <span>Safety validation</span>
        </div>
        <div className="fc-path-item">
          <span className="fc-path-line fc-dashed" style={{ background: EDGE_COLORS.iterate }} />
          <span>Iteration loop</span>
        </div>
      </div>
    </div>
  );
}
