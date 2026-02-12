import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { docEntries } from "./docs/docIndex";
import { Search20Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { preprocessMarkdown } from './MarkdownPage.jsx';
import './styles/Search.css';

export default function GlobalSearch({ onSearchActiveChange }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mdCache, setMdCache] = useState({});
  // Cache of preprocessed plain-text per doc (computed once)
  const textCache = useRef({});

  useEffect(() => {
    docEntries.forEach(item => {
      if (!mdCache[item.content]) {
        fetch(item.content)
          .then(res => res.text())
          .then(text =>
            setMdCache(prev => ({ ...prev, [item.content]: text }))
          );
      }
    });
  }, []);

  // Debounce: update debouncedQuery 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  /**
   * Convert markdown to clean plain text via preprocessMarkdown then strip.
   * Results are cached so each document is only processed once.
   */
  function getPlainText(key, rawMd) {
    if (textCache.current[key]) return textCache.current[key];
    let text = preprocessMarkdown(rawMd);
    text = text
      .replace(/```[\s\S]*?```/g, ' ')         // code blocks
      .replace(/<[^>]+>/g, ' ')                 // HTML tags
      .replace(/`([^`]+)`/g, '$1')              // inline code
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links
      .replace(/^#{1,6}\s+/gm, '')              // headings
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
      .replace(/!\[.*?\]\(.*?\)/g, '')          // images
      .replace(/\|/g, ' ')                      // table pipes
      .replace(/-{3,}/g, '')                    // horizontal rules
      .replace(/^\s*[-*+]\s+/gm, '')            // list markers
      .replace(/^\s*\d+\.\s+/gm, '')            // ordered list markers
      .replace(/^>\s?/gm, '')                   // blockquotes
      .replace(/\n{2,}/g, '\n')                 // collapse blank lines
      .replace(/[ \t]+/g, ' ')                  // normalize spaces
      .trim();
    textCache.current[key] = text;
    return text;
  }

  /**
   * Count all occurrences of query in text.
   */
  function countMatches(text, q) {
    let count = 0, pos = 0;
    const lower = text.toLowerCase();
    while ((pos = lower.indexOf(q, pos)) !== -1) {
      count++;
      pos += q.length;
    }
    return count;
  }

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      onSearchActiveChange(false);
      return;
    }

    onSearchActiveChange(true);

    const q = debouncedQuery.toLowerCase();
    const matches = [];

    for (const item of docEntries) {
      const rawMd = mdCache[item.content];
      if (!rawMd) continue;

      const plainText = getPlainText(item.content, rawMd);
      const idx = plainText.toLowerCase().indexOf(q);
      if (idx === -1) continue;

      // Extract a ~300-char window around the first match
      const WINDOW = 150;
      const start = Math.max(0, idx - WINDOW);
      const end = Math.min(plainText.length, idx + q.length + WINDOW);
      const prefix = start > 0 ? '...' : '';
      const suffix = end < plainText.length ? '...' : '';
      const excerpt = prefix + plainText.substring(start, end) + suffix;

      matches.push({
        ...item,
        excerpt,
        matchCount: countMatches(plainText, q),
      });
    }

    // Sort by match count descending for relevance
    matches.sort((a, b) => b.matchCount - a.matchCount);

    setResults(matches);
    setPage(1);
  }, [debouncedQuery, mdCache]);

  const pagedResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, page]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);

  const handleClick = (path, q) => {
    navigate(path + `?highlight=${encodeURIComponent(q)}`);
  };

  const inputRef = useRef(null);

  function clearQuery() {
    setQuery('');
    setResults([]);
    if (onSearchActiveChange) onSearchActiveChange(false);
    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <div className="search-wrapper">
      <div className="search-input">
        <span className="icon-left">
          <Search20Regular />
        </span>
        <input
          ref={inputRef}
          value={query}
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <span className="icon-right" onClick={clearQuery} aria-label="Clear search">
            <Dismiss24Regular />
          </span>
        )}
      </div>
      {results.length > 0 && <p>{results.length} Results</p>}
      {results.length > 0 && (
        <div className="search-results">
          {pagedResults.map((item, idx) => (
            <SearchResultItem
              key={idx}
              item={item}
              query={query}
              onClick={() => handleClick(item.path, query)}
            />
          ))}

          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
}

function SearchResultItem({ item, query, onClick }) {
  // Highlight all occurrences of query in the plain-text excerpt
  const parts = useMemo(() => {
    if (!query) return [{ text: item.excerpt, highlight: false }];
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${escaped})`, 'gi');
    const segments = item.excerpt.split(re);
    return segments.map((seg, i) => ({
      text: seg,
      highlight: i % 2 === 1, // odd segments are matches from split with capture group
    }));
  }, [item.excerpt, query]);

  return (
    <div className="result-item" onClick={onClick}>
      <div className="result-header">
        <h4>{item.label}</h4>
        {item.matchCount > 1 && (
          <span className="match-count">{item.matchCount} matches</span>
        )}
      </div>
      <p className="result-excerpt">
        {parts.map((part, i) =>
          part.highlight
            ? <mark key={i}>{part.text}</mark>
            : <span key={i}>{part.text}</span>
        )}
      </p>
    </div>
  );
}

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="search-pagination">
      <button className="pagination-button" disabled={page === 1} onClick={() => setPage(page - 1)}>
        1
      </button>
      <button className="pagination-button" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        2
      </button>
    </div>
  );
}
