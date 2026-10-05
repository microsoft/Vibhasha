import React, { useState, useEffect, useMemo, useCallback } from 'react'
import './styles/EvalsDashboard.css'

// ─── Color helpers ──────────────────────────────────────────────
const RESOURCE_COLORS = {
  'Winners': '#166534', 'Underdogs': '#16a34a', 'Rising Stars': '#86efac',
  'Hopefuls': '#fbbf24', 'Scraping-Bys': '#f97316', 'Left-Behinds': '#dc2626',
}
const RESOURCE_CSS = {
  'Winners': 'winners', 'Underdogs': 'underdogs', 'Rising Stars': 'rising-stars',
  'Hopefuls': 'hopefuls', 'Scraping-Bys': 'scraping-bys', 'Left-Behinds': 'left-behinds',
}
const HEAT_STYLES = [
  { background: '#f0f0f0', color: 'var(--evals-text-muted)' },
  { background: '#c7d2fe', color: '#262626' },
  { background: '#818cf8', color: '#262626' },
  { background: '#4f46e5', color: '#fff' },
  { background: '#4338ca', color: '#fff' },
  { background: '#312A9A', color: '#fff' },
]
function heatStyle(val, max) {
  if (!val) return HEAT_STYLES[0]
  const idx = Math.min(Math.floor((val / max) * (HEAT_STYLES.length - 1)) + 1, HEAT_STYLES.length - 1)
  return HEAT_STYLES[idx]
}

// ─── Filtering helpers ──────────────────────────────────────────
function benchmarksForFamily(data, familyName) {
  return data.benchmarks.filter(b => b.families.includes(familyName))
}
function benchmarksForScript(data, scriptName) {
  return data.benchmarks.filter(b => b.scripts.includes(scriptName))
}
function benchmarksForRegion(data, regionName) {
  return data.benchmarks.filter(b => b.continents.includes(regionName))
}
function benchmarksForResourceLevel(data, levelName) {
  return data.benchmarks.filter(b => {
    return data.languages.some(l =>
      l.resource_level === levelName && l.benchmarks.some(bl => bl.benchmark === b.name)
    )
  })
}
function benchmarksForTaskCategory(data, catName) {
  return data.benchmarks.filter(b => b.task_categories.includes(catName))
}
function benchmarksForLongTail(data, benchCount) {
  const langs = data.languages.filter(l => l.num_benchmarks === benchCount)
  const benchNames = new Set(langs.flatMap(l => l.benchmarks.map(bl => bl.benchmark)))
  return data.benchmarks.filter(b => benchNames.has(b.name))
}

// ─── Sub-components ─────────────────────────────────────────────

function StatCard({ number, label, onClick }) {
  return (
    <div className={`stat-card${onClick ? ' stat-card-clickable' : ''}`} onClick={onClick}>
      <div className="number">{number}</div>
      <div className="label">{label}</div>
      {onClick && <div className="stat-click-hint">Click to view</div>}
    </div>
  )
}

// ─── Stat Modal (overlay for stat card clicks) ─────────────────
function StatModal({ statType, data, onClose }) {
  if (!statType) return null

  let title = ''
  let content = null

  switch (statType) {
    case 'benchmarks': {
      title = `All ${data.benchmarks.length} Benchmark Suites Audited`
      const sorted = [...data.benchmarks].sort((a, b) => b.num_languages - a.num_languages)
      content = (
        <div className="stat-modal-list">
          {sorted.map(b => {
            const c = b.citation
            return (
              <div key={b.name} className="stat-modal-item">
                <div className="stat-modal-item-header">
                  <span className="stat-modal-item-name">{b.name}</span>
                  <span className="stat-modal-item-count">{b.num_languages} languages · {b.num_datasets} datasets</span>
                </div>
                {c && c.paper_title && (
                  <div className="stat-modal-item-detail">
                    {c.paper_url ? <a href={c.paper_url} target="_blank" rel="noopener noreferrer">{c.paper_title}</a>
                    : c.arxiv_id ? <a href={`https://arxiv.org/abs/${c.arxiv_id}`} target="_blank" rel="noopener noreferrer">{c.paper_title}</a>
                    : c.paper_title}
                    {c.year && <span className="cite-year"> ({c.year})</span>}
                    {c.venue && <span className="cite-venue"> — {c.venue}</span>}
                  </div>
                )}
                <div className="stat-modal-item-badges">
                  <span className="cite-badge native">{b.n_native} native datasets</span>
                  <span className="cite-badge translated">{b.n_translated} translated datasets</span>
                  <span className="cite-badge grounded">{b.n_grounded} grounded datasets</span>
                </div>
              </div>
            )
          })}
        </div>
      )
      break
    }
    case 'datasets': {
      title = `All ${data.datasets.length} Unique Datasets`
      const sorted = [...data.datasets].sort((a, b) =>
        b.num_languages - a.num_languages || a.name.localeCompare(b.name)
      )
      content = (
        <div className="stat-modal-list">
          {sorted.map(dataset => (
            <div key={dataset.name} className="stat-modal-item">
              <div className="stat-modal-item-header">
                <span className="stat-modal-item-name">{dataset.name}</span>
                <span className="stat-modal-item-count">
                  {dataset.num_languages} language{dataset.num_languages !== 1 ? 's' : ''} · {dataset.num_benchmarks} benchmark suite{dataset.num_benchmarks !== 1 ? 's' : ''}
                </span>
              </div>
              {dataset.task_categories.length > 0 && (
                <div className="stat-modal-item-detail">{dataset.task_categories.join(', ')}</div>
              )}
              <div className="stat-modal-item-meta">
                <span>Included in: {dataset.benchmarks.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )
      break
    }
    case 'languages': {
      title = `All ${data.languages.length} Languages`
      const sorted = [...data.languages].sort((a, b) => b.num_benchmarks - a.num_benchmarks)
      content = (
        <div className="stat-modal-list">
          {sorted.map(l => (
            <div key={l.name} className="stat-modal-item stat-modal-item-compact">
              <div className="stat-modal-item-header">
                <span className="stat-modal-item-name">{l.name}</span>
                <span className="stat-modal-item-count">
                  {l.num_benchmarks} benchmark suite{l.num_benchmarks !== 1 ? 's' : ''} · {l.num_datasets} dataset{l.num_datasets !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="stat-modal-item-meta">
                {l.family && <span>{l.family}</span>}
                {l.script && <span>· {l.script}</span>}
                {l.resource_level && <span>· {l.resource_level}</span>}
                {l.iso_code && <span>· {l.iso_code}</span>}
              </div>
            </div>
          ))}
        </div>
      )
      break
    }
    case 'families': {
      const families = data.distributions.families
      title = `All ${families.length} Language Families`
      content = (
        <div className="stat-modal-list">
          {families.map(f => {
            const langs = data.languages.filter(l => l.family === f.family)
            return (
              <div key={f.family} className="stat-modal-item">
                <div className="stat-modal-item-header">
                  <span className="stat-modal-item-name">{f.family}</span>
                  <span className="stat-modal-item-count">{f.count} languages</span>
                </div>
                <div className="tag-list" style={{ marginTop: 4 }}>
                  {langs.slice(0, 20).map(l => <span className="tag" key={l.name}>{l.name}</span>)}
                  {langs.length > 20 && <span className="tag">+{langs.length - 20} more</span>}
                </div>
              </div>
            )
          })}
        </div>
      )
      break
    }
    case 'scripts': {
      const scripts = data.distributions.scripts
      title = `All ${scripts.length} Scripts`
      content = (
        <div className="stat-modal-list">
          {scripts.map(s => {
            const langs = data.languages.filter(l => l.script === s.script)
            return (
              <div key={s.script} className="stat-modal-item">
                <div className="stat-modal-item-header">
                  <span className="stat-modal-item-name">{s.script}</span>
                  <span className="stat-modal-item-count">{s.count} languages</span>
                </div>
                <div className="tag-list" style={{ marginTop: 4 }}>
                  {langs.slice(0, 20).map(l => <span className="tag" key={l.name}>{l.name}</span>)}
                  {langs.length > 20 && <span className="tag">+{langs.length - 20} more</span>}
                </div>
              </div>
            )
          })}
        </div>
      )
      break
    }
    case 'regions': {
      const regions = data.distributions.continents
      title = `All ${regions.length} Regions`
      content = (
        <div className="stat-modal-list">
          {regions.map(r => {
            const langs = data.languages.filter(l => l.continents.includes(r.continent))
            const benchmarks = data.benchmarks.filter(b => b.continents.includes(r.continent))
            return (
              <div key={r.continent} className="stat-modal-item">
                <div className="stat-modal-item-header">
                  <span className="stat-modal-item-name">{r.continent}</span>
                  <span className="stat-modal-item-count">{r.count} languages · {benchmarks.length} benchmark suites</span>
                </div>
                <div className="stat-modal-item-detail" style={{ marginTop: 4 }}>
                  <strong>Benchmark suites:</strong> {benchmarks.map(b => b.name).join(', ')}
                </div>
              </div>
            )
          })}
        </div>
      )
      break
    }
    case 'tasks': {
      const tasks = data.distributions.task_categories
      title = `All ${tasks.length} Task Types`
      content = (
        <div className="stat-modal-list">
          {tasks.map(t => {
            const benchmarks = data.benchmarks.filter(b => b.task_categories.includes(t.category))
            return (
              <div key={t.category} className="stat-modal-item">
                <div className="stat-modal-item-header">
                  <span className="stat-modal-item-name">{t.category}</span>
                  <span className="stat-modal-item-count">{t.count} languages · {benchmarks.length} benchmark suites</span>
                </div>
                <div className="tag-list" style={{ marginTop: 4 }}>
                  {benchmarks.map(b => <span className="tag" key={b.name}>{b.name}</span>)}
                </div>
              </div>
            )
          })}
        </div>
      )
      break
    }
    default: return null
  }

  return (
    <div className="drilldown-overlay" onClick={onClose}>
      <div className="stat-modal" onClick={e => e.stopPropagation()}>
        <div className="drilldown-header">
          <h3 className="drilldown-title">{title}</h3>
          <button className="drilldown-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="stat-modal-body">
          {content}
        </div>
      </div>
    </div>
  )
}

function HBar({ data, maxVal, colorClass = 'indigo', labelWidth, onBarClick }) {
  const style = labelWidth ? { gridTemplateColumns: `${labelWidth}px 1fr 50px` } : undefined
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div
          className={`bar-row${onBarClick ? ' clickable' : ''}`}
          key={i}
          style={style}
          onClick={onBarClick ? () => onBarClick(d) : undefined}
        >
          <span className="bar-label" title={d.label}>{d.label}</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${typeof colorClass === 'function' ? colorClass(d) : colorClass}`}
              style={{ width: `${(d.value / maxVal) * 100}%` }}
            />
          </div>
          <span className="bar-value">{d.value}{d.pct ? ` (${d.pct}%)` : ''}</span>
        </div>
      ))}
    </div>
  )
}

function StackedBar({ data, total, segments, height = 22 }) {
  return (
    <div className="bar-track stacked-track" style={{ height, display: 'flex' }}>
      {segments.map(seg => {
        const val = data[seg.key] || 0
        const pct = total > 0 ? (val / total) * 100 : 0
        return pct > 0 ? (
          <div
            key={seg.key}
            className={`bar-segment ${seg.css}`}
            style={{ width: `${pct}%`, height: '100%' }}
            title={`${seg.label}: ${val} (${pct.toFixed(1)}%)`}
          />
        ) : null
      })}
    </div>
  )
}

function ChartLegend({ items }) {
  return (
    <div className="chart-legend">
      {items.map((item, i) => (
        <div className="legend-item" key={i}>
          <span className="legend-dot" style={{ background: item.color }} />
          {item.label}
        </div>
      ))}
    </div>
  )
}

// ─── Citation Card (for drill-down panel) ───────────────────────
function BenchmarkCitationCard({ benchmark, languages }) {
  const c = benchmark.citation
  const relevantLangs = languages || []

  return (
    <div className="cite-card">
      <div className="cite-header">
        <span className="cite-name">{benchmark.name}</span>
        <span className="cite-stats">
          {benchmark.num_languages} languages · {benchmark.num_datasets} datasets
        </span>
      </div>
      {c && c.paper_title && (
        <div className="cite-title">
          {c.paper_url ? (
            <a href={c.paper_url} target="_blank" rel="noopener noreferrer">{c.paper_title}</a>
          ) : c.arxiv_id ? (
            <a href={`https://arxiv.org/abs/${c.arxiv_id}`} target="_blank" rel="noopener noreferrer">{c.paper_title}</a>
          ) : (
            c.paper_title
          )}
        </div>
      )}
      {c && (c.authors || c.year || c.venue) && (
        <div className="cite-meta">
          {c.authors && <span>{c.authors}</span>}
          {c.year && <span className="cite-year">{c.year}</span>}
          {c.venue && <span className="cite-venue">{c.venue}</span>}
        </div>
      )}
      <div className="cite-badges">
        <span className="cite-badge native">{benchmark.n_native} native datasets</span>
        <span className="cite-badge translated">{benchmark.n_translated} translated datasets</span>
        <span className="cite-badge grounded">{benchmark.n_grounded} grounded datasets</span>
      </div>
      {relevantLangs.length > 0 && relevantLangs.length <= 30 && (
        <div className="cite-langs">
          <span className="cite-langs-label">Matching languages:</span>
          <div className="tag-list">
            {relevantLangs.map(l => (
              <span className="tag" key={l.name} title={`${l.family || '?'} · ${l.script || '?'}`}>{l.name}</span>
            ))}
          </div>
        </div>
      )}
      {relevantLangs.length > 30 && (
        <div className="cite-langs">
          <span className="cite-langs-label">{relevantLangs.length} matching languages</span>
        </div>
      )}
    </div>
  )
}

// ─── Drill-Down Panel ───────────────────────────────────────────
function DrillDownPanel({ selection, data, onClose }) {
  if (!selection) return null

  const { type, value, title, benchmarks: filteredBenchmarks, description } = selection

  const relevantLangs = useMemo(() => {
    if (!type || !value) return {}
    const result = {}
    for (const b of filteredBenchmarks) {
      result[b.name] = data.languages.filter(l => {
        const inBench = l.benchmarks.some(bl => bl.benchmark === b.name)
        if (!inBench) return false
        switch (type) {
          case 'family': return l.family === value
          case 'script': return l.script === value
          case 'region': case 'region_translation': case 'region_grounding':
            return l.continents.includes(value)
          case 'resource_level': return l.resource_level === value
          case 'task_category': return l.task_categories.includes(value)
          case 'long_tail': return l.num_benchmarks === value
          case 'heatmap': return l.continents.includes(value.region) && l.task_categories.includes(value.task)
          default: return true
        }
      })
    }
    return result
  }, [type, value, filteredBenchmarks, data.languages])

  return (
    <div className="drilldown-overlay" onClick={onClose}>
      <div className="drilldown-panel" onClick={e => e.stopPropagation()}>
        <div className="drilldown-header">
          <div>
            <h3 className="drilldown-title">{title}</h3>
            {description && <p className="drilldown-desc">{description}</p>}
          </div>
          <button className="drilldown-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="drilldown-count">
          {filteredBenchmarks.length} related benchmark suite{filteredBenchmarks.length !== 1 ? 's' : ''}
        </div>
        <div className="drilldown-body">
          {filteredBenchmarks.map(b => (
            <BenchmarkCitationCard
              key={b.name}
              benchmark={b}
              languages={relevantLangs[b.name] || []}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ─────────────────────────────────────────────
export default function EvalsDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [activePillar, setActivePillar] = useState('coverage')
  const [drillDown, setDrillDown] = useState(null)
  const [statModal, setStatModal] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('num_languages')
  const [sortDir, setSortDir] = useState('desc')
  const [expandedBench, setExpandedBench] = useState(null)
  const [regionFilter, setRegionFilter] = useState('')
  const [langSearch, setLangSearch] = useState('')

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/benchmark_data.json')
      .then(r => r.json())
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  const openDrillDown = useCallback((type, value, title, description, benchmarks) => {
    setDrillDown({ type, value, title, description, benchmarks })
  }, [])

  const filteredBenchmarks = useMemo(() => {
    if (!data) return []
    let list = [...data.benchmarks]
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      list = list.filter(b => b.name.toLowerCase().includes(q))
    }
    if (regionFilter) {
      list = list.filter(b => b.continents.includes(regionFilter))
    }
    list.sort((a, b) => {
      const va = a[sortField] ?? 0
      const vb = b[sortField] ?? 0
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [data, searchTerm, regionFilter, sortField, sortDir])

  const filteredLangs = useMemo(() => {
    if (!data || !langSearch || langSearch.length < 2) return []
    const q = langSearch.toLowerCase()
    return data.languages.filter(l =>
      l.name.toLowerCase().includes(q) ||
      (l.iso_code && l.iso_code.toLowerCase().includes(q)) ||
      (l.family && l.family.toLowerCase().includes(q))
    ).slice(0, 20)
  }, [data, langSearch])

  const handleSort = useCallback((field) => {
    setSortField(prev => {
      if (prev === field) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return prev }
      setSortDir('desc')
      return field
    })
  }, [])

  if (error) return <div className="evals-dashboard"><p>Error loading data: {error}</p></div>
  if (!data) return <div className="evals-dashboard" style={{ padding: '80px 0', textAlign: 'center' }}><p>Loading dashboard data...</p></div>

  const { insights, distributions, cross_tabs } = data
  const allRegions = distributions.continents.map(c => c.continent)

  return (
    <div className="evals-dashboard">
      <div className="evals-hero">
        <h1>Multilingual Evaluation Benchmark Survey</h1>
        <p className="subtitle">
          A systematic, data-driven audit of {insights.total_benchmarks} multilingual benchmark suites,
          comprising {insights.total_datasets} unique datasets across {insights.total_languages} languages.
        </p>
        <div className="stats-grid">
          <StatCard number={insights.total_benchmarks} label="Benchmark Suites Audited" onClick={() => setStatModal('benchmarks')} />
          <StatCard number={insights.total_datasets} label="Unique Datasets" onClick={() => setStatModal('datasets')} />
          <StatCard number={insights.total_languages} label="Languages" onClick={() => setStatModal('languages')} />
          <StatCard number={insights.total_families} label="Language Families" onClick={() => setStatModal('families')} />
          <StatCard number={insights.total_scripts} label="Scripts" onClick={() => setStatModal('scripts')} />
          <StatCard number={insights.total_continents} label="Regions" onClick={() => setStatModal('regions')} />
          <StatCard number={insights.total_task_categories} label="Task Types" onClick={() => setStatModal('tasks')} />
        </div>
        <div className="data-scope-note">
          <div><strong>Benchmark suite</strong><span>An audited evaluation collection or publication that can contain multiple datasets.</span></div>
          <div><strong>Dataset</strong><span>A distinct evaluation dataset, deduplicated by name across benchmark suites.</span></div>
          <div><strong>Dataset-language entry</strong><span>One dataset evaluated in one language; the unit used in representativeness analyses.</span></div>
        </div>
      </div>

      <div className="pillar-nav">
        {[
          { id: 'coverage', title: 'Coverage', desc: 'Language coverage across benchmark suites and task categories' },
          { id: 'representativeness', title: 'Representativeness', desc: 'Dataset-level translation and cultural grounding' },
          { id: 'explorer', title: 'Benchmark Suite Explorer', desc: 'Browse the 51 audited benchmark suites' },
          { id: 'lookup', title: 'Language Lookup', desc: 'Compare benchmark-suite and dataset coverage by language' },
        ].map(p => (
          <button
            key={p.id}
            className={`pillar-btn${activePillar === p.id ? ' active' : ''}`}
            onClick={() => setActivePillar(p.id)}
          >
            <div className="pillar-title">{p.title}</div>
            <div className="pillar-desc">{p.desc}</div>
          </button>
        ))}
      </div>

      {activePillar === 'coverage' && (
        <CoveragePillar data={data} distributions={distributions} insights={insights} openDrillDown={openDrillDown} />
      )}

      {activePillar === 'representativeness' && (
        <RepresentativenessPillar data={data} cross_tabs={cross_tabs} insights={insights} openDrillDown={openDrillDown} />
      )}

      {activePillar === 'explorer' && (
        <div className="evals-section">
          <h2>Benchmark Suite Explorer</h2>
          <p className="section-desc">
            Each row is an audited benchmark suite; dataset columns count its constituent datasets.
            Reused datasets appear in each relevant suite here but count once in the unique-dataset total.
          </p>
          <div className="benchmark-controls">
            <input className="benchmark-search" placeholder="Search benchmark suites..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <select className="filter-select" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
              <option value="">All regions</option>
              {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <BenchmarkTable
            benchmarks={filteredBenchmarks}
            expandedBench={expandedBench}
            setExpandedBench={setExpandedBench}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
            languageData={data.languages}
          />
        </div>
      )}

      {activePillar === 'lookup' && (
        <div className="evals-section">
          <h2>Language Lookup</h2>
          <p className="section-desc">Search for any language to compare its benchmark-suite coverage, unique datasets, evaluation origins, and resource level.</p>
          <div className="language-lookup">
            <input
              className="benchmark-search"
              placeholder="Search by language name, ISO code, or family... (min 2 characters)"
              value={langSearch}
              onChange={e => setLangSearch(e.target.value)}
              style={{ maxWidth: 500 }}
            />
            <div className="lang-results">
              {langSearch.length >= 2 && filteredLangs.length === 0 && (
                <p style={{ color: 'var(--evals-text-muted)', fontStyle: 'italic' }}>No languages found matching &ldquo;{langSearch}&rdquo;</p>
              )}
              {filteredLangs.map(lang => (
                <LanguageCard key={lang.name} lang={lang} benchmarkData={data.benchmarks} />
              ))}
            </div>
          </div>
        </div>
      )}

      {drillDown && (
        <DrillDownPanel selection={drillDown} data={data} onClose={() => setDrillDown(null)} />
      )}

      {statModal && (
        <StatModal statType={statModal} data={data} onClose={() => setStatModal(null)} />
      )}

      {(activePillar === 'coverage' || activePillar === 'representativeness') && !drillDown && (
        <div className="click-hint">Click any bar or cell to see related benchmark suites with citations.</div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Coverage Pillar
// ═══════════════════════════════════════════════════════════════
function CoveragePillar({ data, distributions, insights, openDrillDown }) {
  const [coverageTab, setCoverageTab] = useState('longtail')

  const longTailMax = Math.max(...distributions.long_tail.map(d => d.languages))
  const familyMax = Math.max(...distributions.families.map(d => d.count))
  const scriptMax = Math.max(...distributions.scripts.map(d => d.count))
  const continentMax = Math.max(...distributions.continents.map(d => d.count))
  const resourceMax = Math.max(...distributions.resource_levels.map(d => d.count))
  const taskMax = Math.max(...distributions.task_categories.map(d => d.count))

  return (
    <div className="evals-section">
      <h2>Coverage Analysis</h2>
      <p className="section-desc">How broadly do the audited benchmark suites and their datasets cover the world's languages?</p>
      <p className="analysis-unit">
        <strong>Unit of analysis:</strong> unique languages. The benchmark-reach view groups each language by the number of benchmark suites that include it.
      </p>

      <div className="evals-tabs">
        {[
          { id: 'longtail', label: 'Benchmark Reach' },
          { id: 'families', label: 'Families' },
          { id: 'scripts', label: 'Scripts' },
          { id: 'regions', label: 'Regions' },
          { id: 'resources', label: 'Resource Levels' },
          { id: 'tasks', label: 'Task Types' },
        ].map(t => (
          <button key={t.id} className={`evals-tab${coverageTab === t.id ? ' active' : ''}`} onClick={() => setCoverageTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {coverageTab === 'longtail' && (
        <div className="chart-container">
          <h3>How Many Benchmark Suites Include Each Language?</h3>
          <div className="long-tail-callout">
            <strong>{insights.single_benchmark_languages} languages ({insights.single_benchmark_pct}%)</strong> appear in only one benchmark suite.
          </div>
          <div className="long-tail-chart">
            <div className="long-tail-bars">
              {distributions.long_tail.map((d) => {
                const h = (d.languages / longTailMax) * 100
                const cls = d.count === 1 ? 'lt-bar-1' : d.count === 2 ? 'lt-bar-2' : d.count <= 5 ? 'lt-bar-3' : 'lt-bar-default'
                return (
                  <div
                    key={d.count}
                    className={`lt-bar ${cls}`}
                    style={{ height: `${h}%` }}
                    onClick={() => openDrillDown(
                      'long_tail', d.count,
                      `Languages in exactly ${d.count} benchmark suite${d.count !== 1 ? 's' : ''}`,
                      `${d.languages} languages appear in exactly ${d.count} benchmark suite${d.count !== 1 ? 's' : ''}`,
                      benchmarksForLongTail(data, d.count)
                    )}
                  >
                    <div className="lt-tooltip">{d.languages} language{d.languages !== 1 ? 's' : ''} in {d.count} benchmark suite{d.count !== 1 ? 's' : ''} — click for details</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--evals-text-muted)', marginTop: 4 }}>
              <span>1 benchmark suite</span>
              <span>{distributions.long_tail[distributions.long_tail.length - 1]?.count} benchmark suites</span>
            </div>
          </div>
        </div>
      )}

      {coverageTab === 'families' && (
        <div className="chart-container">
          <h3>Language Family Representation ({insights.total_families} families)</h3>
          <HBar
            data={distributions.families.slice(0, 20).map(d => ({ label: d.family, value: d.count, pct: Math.round(100 * d.count / insights.total_languages), _key: d.family }))}
            maxVal={familyMax}
            colorClass={(d) => d.label === 'Indo-European' ? 'slate' : 'indigo'}
            labelWidth={180}
            onBarClick={(d) => openDrillDown('family', d._key, `Family: ${d._key}`, `${d.value} languages from the ${d._key} family`, benchmarksForFamily(data, d._key))}
          />
          {distributions.families.length > 20 && <p style={{ fontSize: '0.82rem', color: 'var(--evals-text-muted)', marginTop: 8 }}>+{distributions.families.length - 20} more families</p>}
        </div>
      )}

      {coverageTab === 'scripts' && (
        <div className="chart-container">
          <h3>Script Distribution ({insights.total_scripts} scripts)</h3>
          <HBar
            data={distributions.scripts.slice(0, 20).map(d => ({ label: d.script, value: d.count, pct: Math.round(100 * d.count / insights.total_languages), _key: d.script }))}
            maxVal={scriptMax}
            colorClass="teal"
            labelWidth={180}
            onBarClick={(d) => openDrillDown('script', d._key, `Script: ${d._key}`, `${d.value} languages using ${d._key} script`, benchmarksForScript(data, d._key))}
          />
        </div>
      )}

      {coverageTab === 'regions' && (
        <div className="chart-container">
          <h3>Continental / Regional Coverage</h3>
          <HBar
            data={distributions.continents.map(d => ({ label: d.continent, value: d.count, _key: d.continent }))}
            maxVal={continentMax}
            colorClass="indigo-light"
            labelWidth={200}
            onBarClick={(d) => openDrillDown('region', d._key, `Region: ${d._key}`, `${d.value} languages in ${d._key}`, benchmarksForRegion(data, d._key))}
          />
        </div>
      )}

      {coverageTab === 'resources' && (
        <div className="chart-container">
          <h3>Resource Level Distribution (Joshi et al. Taxonomy)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--evals-text-muted)', marginBottom: 16 }}>Counts are unique languages. Click any bar to see related benchmark suites.</p>
          <div className="bar-chart resource-bars">
            {distributions.resource_levels.map((d, i) => (
              <div
                className="bar-row clickable"
                key={i}
                style={{ gridTemplateColumns: '160px 1fr 50px' }}
                onClick={() => openDrillDown('resource_level', d.level, `Resource Level: ${d.level}`, `${d.count} languages at the "${d.level}" level`, benchmarksForResourceLevel(data, d.level))}
              >
                <span className="bar-label">{d.level}</span>
                <div className="bar-track">
                  <div className={`bar-fill ${RESOURCE_CSS[d.level] || 'indigo'}`} style={{ width: `${(d.count / resourceMax) * 100}%` }} />
                </div>
                <span className="bar-value">{d.count}</span>
              </div>
            ))}
          </div>
          <ChartLegend items={Object.entries(RESOURCE_COLORS).map(([k, v]) => ({ label: k, color: v }))} />
        </div>
      )}

      {coverageTab === 'tasks' && (
        <div className="chart-container">
          <h3>Languages per Task Category</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--evals-text-muted)', marginBottom: 16 }}>Counts are unique languages. Click a bar to see related benchmark suites.</p>
          <HBar
            data={distributions.task_categories.map(d => ({ label: d.category, value: d.count, _key: d.category }))}
            maxVal={taskMax}
            colorClass="indigo"
            labelWidth={180}
            onBarClick={(d) => openDrillDown('task_category', d._key, `Task: ${d._key}`, `${d.value} unique languages evaluated on ${d._key}`, benchmarksForTaskCategory(data, d._key))}
          />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Representativeness Pillar
// ═══════════════════════════════════════════════════════════════
function RepresentativenessPillar({ data, cross_tabs, insights, openDrillDown }) {
  const [repTab, setRepTab] = useState('translation')

  const transByRegion = cross_tabs.translation_by_region
  const groundByRegion = cross_tabs.grounding_by_region
  const taskByRegion = cross_tabs.task_by_region
  const allTaskCats = [...new Set(Object.values(taskByRegion).flatMap(v => Object.keys(v)))].sort()
  const heatMax = Math.max(...Object.values(taskByRegion).flatMap(v => Object.values(v)))

  return (
    <div className="evals-section">
      <h2>Representativeness Analysis</h2>
      <p className="section-desc">Are evaluation datasets natively created or translated from English? Do they reflect the cultures they evaluate?</p>
      <p className="analysis-unit">
        <strong>Unit of analysis:</strong> dataset-language entries. Each of the {insights.total_dataset_language_entries} entries represents one unique dataset evaluated in one language; a benchmark suite can contribute many entries.
      </p>

      <div className="evals-tabs">
        {[
          { id: 'translation', label: 'Translation Status' },
          { id: 'cultural', label: 'Cultural Grounding' },
          { id: 'taskheat', label: 'Tasks × Regions' },
          { id: 'overview', label: 'Key Findings' },
        ].map(t => (
          <button key={t.id} className={`evals-tab${repTab === t.id ? ' active' : ''}`} onClick={() => setRepTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {repTab === 'translation' && (
        <div className="chart-container">
          <h3>Dataset Translation Status by Region</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--evals-text-muted)', marginBottom: 12 }}>Counts are dataset-language entries. Click any row to see related benchmark suites.</p>
          <ChartLegend items={[{ label: 'Native', color: '#22c55e' }, { label: 'Translated', color: '#ef4444' }, { label: 'Unknown', color: '#d1d5db' }]} />
          <div className="bar-chart stacked-bar-chart">
            {transByRegion.map((d, i) => (
              <div
                className="bar-row clickable"
                key={i}
                style={{ gridTemplateColumns: '200px 1fr 100px' }}
                onClick={() => openDrillDown('region_translation', d.region, `Translation Status: ${d.region}`, `${d.native} native, ${d.translated} translated, ${d.unknown} unknown dataset-language entries`, benchmarksForRegion(data, d.region))}
              >
                <span className="bar-label">{d.region}</span>
                <StackedBar data={d} total={d.total} segments={[{ key: 'native', css: 'native', label: 'Native' }, { key: 'translated', css: 'translated', label: 'Translated' }, { key: 'unknown', css: 'unknown', label: 'Unknown' }]} />
                <span className="bar-value" style={{ fontSize: '0.75rem' }}>n={d.total} entries</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {repTab === 'cultural' && (
        <div className="chart-container">
          <h3>Dataset Cultural Grounding by Region</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--evals-text-muted)', marginBottom: 12 }}>Counts are dataset-language entries. Click any row to see related benchmark suites.</p>
          <ChartLegend items={[{ label: 'Culturally Grounded', color: '#22c55e' }, { label: 'Not Grounded', color: '#ef4444' }]} />
          <div className="bar-chart stacked-bar-chart">
            {groundByRegion.map((d, i) => (
              <div
                className="bar-row clickable"
                key={i}
                style={{ gridTemplateColumns: '200px 1fr 100px' }}
                onClick={() => openDrillDown('region_grounding', d.region, `Cultural Grounding: ${d.region}`, `${d.grounded} grounded and ${d.not_grounded} not grounded dataset-language entries`, benchmarksForRegion(data, d.region))}
              >
                <span className="bar-label">{d.region}</span>
                <StackedBar data={d} total={d.total} segments={[{ key: 'grounded', css: 'grounded', label: 'Grounded' }, { key: 'not_grounded', css: 'not-grounded', label: 'Not Grounded' }]} />
                <span className="bar-value" style={{ fontSize: '0.75rem' }}>n={d.total} entries</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {repTab === 'taskheat' && (
        <div className="chart-container">
          <h3>Dataset-Language Entries by Task Category and Region</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--evals-text-muted)', marginBottom: 12 }}>Each cell counts dataset-language entries. Click any cell to see related benchmark suites.</p>
          <div className="heatmap-wrap">
            <table className="heatmap-table">
              <thead>
                <tr>
                  <th></th>
                  {allTaskCats.map(tc => <th key={tc} className="rotate">{tc}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(taskByRegion).sort((a, b) => {
                  const sumA = Object.values(a[1]).reduce((s, v) => s + v, 0)
                  const sumB = Object.values(b[1]).reduce((s, v) => s + v, 0)
                  return sumB - sumA
                }).map(([region, cats]) => (
                  <tr key={region}>
                    <td className="region-label">{region}</td>
                    {allTaskCats.map(tc => {
                      const val = cats[tc] || 0
                      return (
                        <td
                          key={tc}
                          className={val > 0 ? 'heatmap-clickable' : ''}
                          onClick={val > 0 ? () => {
                            const matches = data.benchmarks.filter(b => b.continents.includes(region) && b.task_categories.includes(tc))
                            openDrillDown('heatmap', { region, task: tc }, `${region} × ${tc}`, `${val} dataset-language entries`, matches)
                          } : undefined}
                        >
                          <span className={`heatmap-cell${val === 0 ? ' empty' : ''}`} style={heatStyle(val, heatMax)} title={`${region} × ${tc}: ${val} dataset-language entries`}>
                            {val > 0 ? val : '—'}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {repTab === 'overview' && (
        <div className="chart-container">
          <h3>Key Findings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="long-tail-callout" style={{ borderLeftColor: '#ef4444', background: '#fef2f2' }}>
              <strong>{insights.pct_translated}%</strong> of dataset-language entries with known translation status are translated from English, rather than natively authored.
            </div>
            <div className="long-tail-callout" style={{ borderLeftColor: '#22c55e', background: '#f0fdf4', color: '#166534' }}>
              <strong>{insights.total_grounded_entries}</strong> dataset-language entries are culturally grounded.
            </div>
            <div className="long-tail-callout" style={{ borderLeftColor: '#f97316', background: '#fff7ed', color: '#9a3412' }}>
              <strong>{insights.single_benchmark_pct}%</strong> of all surveyed languages appear in only one benchmark suite.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Benchmark Table
// ═══════════════════════════════════════════════════════════════
function BenchmarkTable({ benchmarks, expandedBench, setExpandedBench, sortField, sortDir, onSort, languageData }) {
  const cols = [
    { key: 'name', label: 'Benchmark Suite' },
    { key: 'num_languages', label: 'Languages' },
    { key: 'num_datasets', label: 'Datasets' },
    { key: 'n_native', label: 'Native Datasets' },
    { key: 'n_translated', label: 'Translated Datasets' },
    { key: 'n_grounded', label: 'Grounded Datasets' },
  ]

  return (
    <div className="benchmark-table-wrap">
      <table className="benchmark-table">
        <thead>
          <tr>
            {cols.map(col => (
              <th key={col.key} onClick={() => onSort(col.key)}>
                {col.label}
                <span className={`sort-arrow${sortField === col.key ? ' active' : ''}`}>
                  {sortField === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '▼'}
                </span>
              </th>
            ))}
            <th>Dataset Translation Ratio</th>
          </tr>
        </thead>
        <tbody>
          {benchmarks.map(b => {
            const isExpanded = expandedBench === b.name
            const total = b.n_native + b.n_translated
            return (
              <React.Fragment key={b.name}>
                <tr className={isExpanded ? 'expanded' : ''} onClick={() => setExpandedBench(isExpanded ? null : b.name)}>
                  <td><div className="name-cell"><span className={`expand-icon${isExpanded ? ' open' : ''}`}>▶</span>{b.name}</div></td>
                  <td>{b.num_languages}</td>
                  <td>{b.num_datasets}</td>
                  <td>{b.n_native}</td>
                  <td>{b.n_translated}</td>
                  <td>{b.n_grounded}</td>
                  <td>
                    {total > 0 && (
                      <div className="mini-bar" title={`${b.n_native} native datasets / ${b.n_translated} translated datasets`}>
                        <div className="mini-seg" style={{ width: `${(b.n_native / total) * 100}%`, background: '#22c55e' }} />
                        <div className="mini-seg" style={{ width: `${(b.n_translated / total) * 100}%`, background: '#ef4444' }} />
                      </div>
                    )}
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="benchmark-detail"><td colSpan={7}><BenchmarkDetail benchmark={b} languageData={languageData} /></td></tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
      {benchmarks.length === 0 && <p style={{ textAlign: 'center', padding: 24, color: 'var(--evals-text-muted)' }}>No benchmark suites match your filters.</p>}
    </div>
  )
}

function BenchmarkDetail({ benchmark, languageData }) {
  const benchLangs = languageData.filter(l => l.benchmarks.some(bl => bl.benchmark === benchmark.name)).sort((a, b) => a.name.localeCompare(b.name))
  const c = benchmark.citation

  return (
    <div className="detail-grid">
      {c && c.paper_title && (
        <div className="detail-card" style={{ gridColumn: '1 / -1' }}>
          <h4>Paper</h4>
          <div className="cite-title" style={{ marginBottom: 4 }}>
            {c.paper_url ? <a href={c.paper_url} target="_blank" rel="noopener noreferrer">{c.paper_title}</a>
            : c.arxiv_id ? <a href={`https://arxiv.org/abs/${c.arxiv_id}`} target="_blank" rel="noopener noreferrer">{c.paper_title}</a>
            : c.paper_title}
          </div>
          <div className="cite-meta">
            {c.authors && <span>{c.authors}</span>}
            {c.year && <span className="cite-year">{c.year}</span>}
            {c.venue && <span className="cite-venue">{c.venue}</span>}
          </div>
        </div>
      )}
      {benchmark.description && (
        <div className="detail-card" style={{ gridColumn: '1 / -1' }}>
          <h4>Description</h4>
          <p style={{ fontSize: '0.85rem', color: '#444', margin: 0, lineHeight: 1.5 }}>{benchmark.description}</p>
          {(benchmark.year || benchmark.benchmark_type) && (
            <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--evals-text-muted)', display: 'flex', gap: 16 }}>
              {benchmark.year && <span>Year: {benchmark.year}</span>}
              {benchmark.benchmark_type && <span>Type: {benchmark.benchmark_type}</span>}
            </div>
          )}
        </div>
      )}
      <div className="detail-card" style={{ gridColumn: '1 / -1' }}>
        <h4>Datasets ({benchmark.datasets.length})</h4>
        <div className="tag-list">
          {benchmark.datasets.map(dataset => (
            <span
              className="tag"
              key={dataset.name}
              title={[dataset.task_category, dataset.translated, `${dataset.num_languages} language${dataset.num_languages !== 1 ? 's' : ''}`].filter(Boolean).join(' · ')}
            >
              {dataset.name}
            </span>
          ))}
        </div>
      </div>
      <div className="detail-card">
        <h4>Regions ({benchmark.continents.length})</h4>
        <div className="tag-list">{benchmark.continents.map(c => <span className="tag" key={c}>{c}</span>)}</div>
      </div>
      <div className="detail-card">
        <h4>Task Categories ({benchmark.task_categories.length})</h4>
        <div className="tag-list">{benchmark.task_categories.map(c => <span className="tag" key={c}>{c}</span>)}</div>
      </div>
      <div className="detail-card">
        <h4>Language Families ({benchmark.families.length})</h4>
        <div className="tag-list">
          {benchmark.families.slice(0, 15).map(f => <span className="tag" key={f}>{f}</span>)}
          {benchmark.families.length > 15 && <span className="tag">+{benchmark.families.length - 15} more</span>}
        </div>
      </div>
      <div className="detail-card" style={{ gridColumn: '1 / -1' }}>
        <h4>Languages ({benchLangs.length})</h4>
        <div className="tag-list">
          {benchLangs.map(l => {
            const entry = l.benchmarks.find(bl => bl.benchmark === benchmark.name)
            const status = entry?.translation_status || 'Unknown'
            const cls = status === 'Native' ? 'native' : status === 'Translated' ? 'translated' : ''
            const datasetCount = entry?.num_datasets || 0
            return <span className={`tag ${cls}`} key={l.name} title={`${l.name} · ${datasetCount} dataset${datasetCount !== 1 ? 's' : ''} · ${status}`}>{l.name}</span>
          })}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Language Card (with citation info)
// ═══════════════════════════════════════════════════════════════
function LanguageCard({ lang, benchmarkData }) {
  const benchLookup = useMemo(() => {
    const m = {}
    for (const b of benchmarkData) m[b.name] = b
    return m
  }, [benchmarkData])

  return (
    <div className="lang-card">
      <h3>{lang.name}</h3>
      <div className="lang-meta">
        <span>Family: {lang.family || 'Unknown'}</span>
        <span>Script: {lang.script || 'Unknown'}</span>
        <span>Resource level: {lang.resource_level || 'Unknown'} (Level {lang.joshi_level ?? '?'})</span>
        {lang.iso_code && <span>ISO code: {lang.iso_code}</span>}
        {lang.continents.length > 0 && <span>Regions: {lang.continents.join(', ')}</span>}
        {lang.dialect_of && <span>Dialect of: {lang.dialect_of}</span>}
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--evals-text-success)', fontWeight: 600 }}>{lang.native_count} native dataset-language entries</span>
        <span style={{ color: 'var(--evals-text-danger)', fontWeight: 600 }}>{lang.translated_count} translated dataset-language entries</span>
        <span style={{ color: '#0f766e', fontWeight: 600 }}>{lang.grounded_count} culturally grounded dataset-language entries</span>
      </div>
      <div className="lang-benchmarks">
        <h4>
          Appears in {lang.num_benchmarks} benchmark suite{lang.num_benchmarks !== 1 ? 's' : ''} across {lang.num_datasets} unique dataset{lang.num_datasets !== 1 ? 's' : ''}:
        </h4>
        <div className="lang-bench-list">
          {lang.benchmarks.map((bl, i) => {
            const cls = bl.translation_status === 'Native' ? 'native-chip' : bl.translation_status === 'Translated' ? 'translated-chip' : 'unknown-chip'
            const cite = benchLookup[bl.benchmark]?.citation
            const tooltip = [
              `${bl.num_datasets} dataset${bl.num_datasets !== 1 ? 's' : ''}`,
              `${bl.native_count} native`,
              `${bl.translated_count} translated`,
              `${bl.grounded_count} culturally grounded`,
              cite?.year ? `(${cite.year})` : '',
              cite?.venue || '',
            ].filter(Boolean).join(' · ')
            return (
              <span className={`bench-chip ${cls}`} key={i} title={tooltip}>
                {bl.benchmark}{cite?.year && <span className="chip-year"> ({cite.year})</span>}
              </span>
            )
          })}
        </div>
      </div>
      {lang.benchmarks.some(bl => benchLookup[bl.benchmark]?.citation?.paper_title) && (
        <details className="lang-refs" style={{ marginTop: 10 }}>
          <summary style={{ fontSize: '0.82rem', color: 'var(--color-header-bg, #312A9A)', cursor: 'pointer', fontWeight: 600 }}>
            References ({lang.benchmarks.filter(bl => benchLookup[bl.benchmark]?.citation?.paper_title).length})
          </summary>
          <div className="lang-ref-list">
            {lang.benchmarks.map((bl, i) => {
              const cite = benchLookup[bl.benchmark]?.citation
              if (!cite?.paper_title) return null
              const url = cite.paper_url || (cite.arxiv_id ? `https://arxiv.org/abs/${cite.arxiv_id}` : null)
              return (
                <div key={i} className="lang-ref-item">
                  <span className="lang-ref-name">{bl.benchmark}</span>
                  {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="lang-ref-title">{cite.paper_title}</a> : <span className="lang-ref-title">{cite.paper_title}</span>}
                  <span className="lang-ref-meta">{[cite.authors, cite.year, cite.venue].filter(Boolean).join(' · ')}</span>
                </div>
              )
            })}
          </div>
        </details>
      )}
      {lang.task_categories.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <h4 style={{ fontSize: '0.82rem', color: '#444', margin: '0 0 4px' }}>Tasks evaluated:</h4>
          <div className="tag-list">{lang.task_categories.map(tc => <span className="tag" key={tc}>{tc}</span>)}</div>
        </div>
      )}
    </div>
  )
}
