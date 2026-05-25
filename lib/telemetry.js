/**
 * Telemetry module — Paza / Atlas / Vibhasha playbooks.
 *
 * Single dependency: @microsoft/applicationinsights-web (v3.x).
 *
 * This file is IDENTICAL byte-for-byte across all three playbook repos.
 * Components import named helpers and call `setChapterContext()` on route
 * change — never `appInsights.trackEvent` directly.
 *
 * Spec: telemetry_doc.md (local, not tracked)
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// ---------------------------------------------------------------------------
// SDK instance (null when connection string is missing -> all helpers no-op)
// ---------------------------------------------------------------------------
let appInsights = null;

// ---------------------------------------------------------------------------
// Current chapter context — set by components via setChapterContext on each
// route change. Components are the single source of truth for what counts as
// a "chapter" (they read docEntries); telemetry just reflects whatever they
// last announced.
// ---------------------------------------------------------------------------
const currentContext = {
  chapter_id: 'unknown',
  chapter_title: 'Unknown',
  parent_chapter_id: null,
  parent_chapter_title: null,
  is_subchapter: false,
  route: '/',
};

/**
 * Update the chapter context attached to every subsequent telemetry item.
 * Call from `MarkdownPage` (or any router-aware component) on route change.
 * Fields not provided are left untouched.
 */
export function setChapterContext(ctx = {}) {
  Object.assign(currentContext, ctx);
}

// ---------------------------------------------------------------------------
// Per-session dedup state
// ---------------------------------------------------------------------------
const scrollFiredSet = new Set();      // keyed by `${chapter_id}_${milestone}`
const interactiveUsedSet = new Set();  // tool names

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

  // Enrich every telemetry item with playbook + the current chapter context.
  appInsights.addTelemetryInitializer((envelope) => {
    envelope.data = envelope.data || {};
    envelope.data.playbook = playbook;
    envelope.data.chapter_id = currentContext.chapter_id;
    envelope.data.chapter_title = currentContext.chapter_title;
    envelope.data.parent_chapter_id = currentContext.parent_chapter_id;
    envelope.data.parent_chapter_title = currentContext.parent_chapter_title;
    envelope.data.is_subchapter = currentContext.is_subchapter;
    envelope.data.route = currentContext.route;
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

/**
 * Fired when the user crosses a 25/50/75/100% scroll milestone on a chapter.
 * Dedup is per-chapter+milestone, so the same key won't fire twice in a session.
 * @param {{ milestone: number }} p
 */
export function trackScrollMilestone(p) {
  const key = `${currentContext.chapter_id}_${p.milestone}`;
  if (scrollFiredSet.has(key)) return;
  scrollFiredSet.add(key);
  track('ScrollMilestone', p);
}

/**
 * Reset the scroll-milestone dedup `Set` for the current chapter. Call on
 * route change so re-visits within a session re-fire milestones.
 */
export function resetScrollDedup() {
  scrollFiredSet.clear();
}

/**
 * Fired only on Next-button click. Auto-fire from 100% scroll was removed —
 * scrolling to the bottom is not a reliable "I'm done" signal (it triggers
 * the moment the prev/next nav enters the viewport).
 * @param {{ completion_method?: 'next_button' }} [p]
 */
export function trackChapterCompleted(p = {}) {
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

/** @param {{ language: string }} p */
export function trackCodeCopied(p) {
  track('CodeCopied', p);
}

/** @param {{ language: string }} p */
export function trackCodeDownloaded(p) {
  track('CodeDownloaded', p);
}

/** @param {{ url_domain: string, link_text?: string, link_context?: 'header'|'footer'|'content'|'sidebar' }} p */
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

/** @param {{ tool: string, option_id: string, option_label?: string }} p */
export function trackInteractiveOptionSelected(p) {
  track('InteractiveOptionSelected', p);
}

/** @param {{ tool: string, config_key: string, config_value: string|number|boolean }} p */
export function trackInteractiveConfigChanged(p) {
  track('InteractiveConfigChanged', p);
}

/** @param {{ tool: string, item_id: string, checked: boolean }} p */
export function trackChecklistItemToggled(p) {
  track('ChecklistItemToggled', p);
}

// ---------------------------------------------------------------------------
// Escape hatch for playbook-specific custom metrics. Use sparingly — prefer
// extending the canonical schema with a new `tool` value over a one-off event.
// Context fields are still attached automatically by the telemetry initializer.
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
