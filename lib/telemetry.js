/**
 * Telemetry module — Paza / Atlas / Vibhasha playbooks.
 *
 * Single dependency: @microsoft/applicationinsights-web (v3.x).
 * All custom events and dedup logic live here. Components import named
 * helpers — never call `appInsights.trackEvent` directly.
 *
 * This file is IDENTICAL byte-for-byte across all three playbook repos.
 * The only thing that differs is the `playbook` argument passed to
 * `initTelemetry()` from `main.jsx` and the connection string in `.env`.
 *
 * Spec: telemetry_doc.md (local, not tracked)
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// ---------------------------------------------------------------------------
// SDK instance (null when connection string is missing -> all helpers no-op)
// ---------------------------------------------------------------------------
let appInsights = null;

// ---------------------------------------------------------------------------
// Dedup state
// ---------------------------------------------------------------------------
const scrollFiredSet = new Set();        // milestones fired on current route
const interactiveUsedSet = new Set();    // tools touched this session
let chapterCompletedFired = false;       // one completion per page load

/** Call on route change to reset per-page scroll dedup state. */
export function resetScrollDedup() {
  scrollFiredSet.clear();
}

/** Call on route change to allow a new chapter completion. */
export function resetChapterCompleted() {
  chapterCompletedFired = false;
}

// ---------------------------------------------------------------------------
// Chapter resolution (route-based, portable across all three playbooks).
// Handles SPA basenames like /Paza/, /AtlasPlaybook/, etc. by looking for the
// "playbook" segment anywhere in the path rather than anchoring to the root.
// ---------------------------------------------------------------------------
function resolveChapterId() {
  if (typeof window === 'undefined') return 'unknown';
  const path = window.location.pathname.replace(/\/+$/, '');
  const segments = path.split('/').filter(Boolean).map((s) => s.toLowerCase());
  if (segments.length === 0) return 'landing';
  const pbIdx = segments.indexOf('playbook');
  if (pbIdx === -1) {
    // Top-level non-playbook route (landing page under any basename).
    return 'landing';
  }
  const after = segments.slice(pbIdx + 1);
  if (after.length === 0) return 'overview';
  return after[after.length - 1];
}

function resolveChapterTitle() {
  const id = resolveChapterId();
  if (id === 'landing') return 'Landing';
  if (id === 'overview') return 'Overview';
  if (id === 'unknown') return 'Unknown';
  // Humanize slug: strip leading "NN-" / "NN-i-" prefix, replace dashes.
  return id
    .replace(/^[0-9]+-(?:[ivx]+-)?/i, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

/**
 * Initialise Application Insights. Call once before createRoot().
 * @param {string} playbook - lowercase playbook name ("paza" | "atlas" | "vibhasha")
 */
export function initTelemetry(playbook) {
  const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;
  if (!connectionString) {
    // eslint-disable-next-line no-console
    console.debug('[telemetry] No connection string — running without telemetry.');
    return;
  }

  appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: true,   // auto page views on SPA route change
      disableExceptionTracking: false, // auto-capture unhandled errors
      /* Defaults we rely on (no need to override):
         disableFlushOnBeforeUnload: false  -> flush on tab close
         enableSessionStorageBuffer: true   -> buffer unsent events
         maxBatchInterval: 15000            -> batch every 15s
         samplingPercentage: 100            -> send all                  */
    },
  });

  appInsights.loadAppInsights();

  // Enrich ALL telemetry (incl. auto page views, exceptions) with playbook context.
  appInsights.addTelemetryInitializer((envelope) => {
    envelope.data = envelope.data || {};
    envelope.data.playbook = playbook;
    envelope.data.chapter_id = resolveChapterId();
    envelope.data.chapter_title = resolveChapterTitle();
    envelope.data.route = window.location.pathname;
  });

  // eslint-disable-next-line no-console
  console.debug('[telemetry] Initialised for playbook:', playbook);
}

// ---------------------------------------------------------------------------
// Internal track wrapper (guards null SDK)
// ---------------------------------------------------------------------------
function track(name, properties = {}) {
  if (!appInsights) return;
  appInsights.trackEvent({ name, properties });
}

// ===========================================================================
// Canonical event helpers (see telemetry_doc.md §3)
// ===========================================================================

// ---- 3.1 Reading & Completion --------------------------------------------

/** @param {{ milestone: number, content_height?: number, time_to_milestone_ms?: number }} p */
export function trackScrollMilestone(p) {
  const key = `${resolveChapterId()}_${p.milestone}`;
  if (scrollFiredSet.has(key)) return;
  scrollFiredSet.add(key);
  track('ScrollMilestone', p);
}

/** @param {{ completion_method?: 'scroll_bottom'|'next_button', time_on_page_ms?: number }} [p] */
export function trackChapterCompleted(p = {}) {
  if (chapterCompletedFired) return;
  chapterCompletedFired = true;
  track('ChapterCompleted', p);
}

// ---- 3.2 Navigation ------------------------------------------------------

/** @param {{ from_chapter: string, to_chapter: string }} p */
export function trackSidebarNavigation(p) {
  track('SidebarNavigation', p);
}

/** @param {{ direction: 'next'|'previous' }} p */
export function trackChapterNavigation(p) {
  track('ChapterNavigation', p);
}

/** @param {{ target_playbook: string, source_playbook: string }} p */
export function trackCrossPlaybookNavigation(p) {
  track('CrossPlaybookNavigation', p);
}

// ---- 3.3 Search (Atlas, Vibhasha) ----------------------------------------

/** @param {{ query_length: number, results_count: number, has_results?: boolean }} p */
export function trackSearchPerformed(p) {
  track('SearchPerformed', p);
}

/** @param {{ result_chapter: string, result_rank: number }} p */
export function trackSearchResultClicked(p) {
  track('SearchResultClicked', p);
}

// ---- 3.4 Engagement ------------------------------------------------------

/** @param {{ language: string, snippet_length?: number, snippet_preview?: string }} p */
export function trackCodeCopied(p) {
  const props = { ...p };
  if (props.snippet_preview) {
    props.snippet_preview = String(props.snippet_preview).slice(0, 50);
  }
  track('CodeCopied', props);
}

/** @param {{ url_domain: string, link_text?: string, link_context?: 'header'|'footer'|'content' }} p */
export function trackExternalLinkClick(p) {
  track('ExternalLinkClick', p);
}

/** @param {{ export_scope: 'chapter'|'full' }} p */
export function trackPDFDownloaded(p) {
  track('PDFDownloaded', p);
}

// ---- 3.5 Interactive Features --------------------------------------------

/** @param {{ tool: string }} p */
export function trackInteractiveUsed(p) {
  if (interactiveUsedSet.has(p.tool)) return;
  interactiveUsedSet.add(p.tool);
  track('InteractiveUsed', p);
}

/** @param {{ tool: string, config_key: string, config_value: string|number|boolean }} p */
export function trackInteractiveConfigChanged(p) {
  track('InteractiveConfigChanged', p);
}

/** @param {{ tool: string, option_id: string, option_label?: string }} p */
export function trackInteractiveOptionSelected(p) {
  track('InteractiveOptionSelected', p);
}

/** @param {{ tool: string, item_id: string, checked: boolean }} p */
export function trackChecklistItemToggled(p) {
  track('ChecklistItemToggled', p);
}

// ---------------------------------------------------------------------------
// Escape hatch for playbook-specific custom metrics.
// Use sparingly — prefer extending the canonical schema with a new `tool`
// value over adding one-off custom events. Global properties (playbook,
// chapter_id, etc.) are still attached by the telemetry initializer.
// ---------------------------------------------------------------------------

/**
 * @param {string} name - PascalCase event name
 * @param {Record<string, any>} [properties]
 */
export function trackCustom(name, properties = {}) {
  track(name, properties);
}

// ---------------------------------------------------------------------------
// Testing helper — returns whether telemetry is active.
// ---------------------------------------------------------------------------
export function isTelemetryActive() {
  return appInsights !== null;
}
