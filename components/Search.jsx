import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { docEntries } from "./docs/docIndex";
import { Search20Regular, Dismiss24Regular } from '@fluentui/react-icons';
import './styles/Search.css';
import { trackSearchPerformed, trackSearchResultClicked } from '../lib/telemetry.js';

export default function GlobalSearch({ onSearchActiveChange }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [mdCache, setMdCache] = useState({});

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

  function markdownToText(md) {
    return md
      .replace(/```[\s\S]*?```/g, " ")       // code blocks
      .replace(/`([^`]+)`/g, "$1")           // inline code
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")  // links
      .replace(/^#{1,6}\s+/gm, "")           // headings
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")  // bold/italic
      .replace(/\|/g, " ")                   // tables pipes
      .trim();
  }


  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      onSearchActiveChange(false);
      return;
    }

    onSearchActiveChange(true);

    const q = query.toLowerCase();
    const matches = [];

    for (const item of docEntries) {
      const text = mdCache[item.content];
      if (!text) continue;

      const idx = text.toLowerCase().indexOf(q);
      if (idx === -1) continue;

      const excerptStart = Math.max(0, idx - 100);
      const excerptEnd = idx + q.length + 600;

      matches.push({
        ...item,
        excerpt:
          markdownToText(text)
        // .substring(excerptStart, excerptEnd)
      });
    }

    setResults(matches);
    setPage(1);
  }, [query, mdCache]);

  // Telemetry: emit SearchPerformed once per settled query (debounced).
  useEffect(() => {
    const q = query.trim();
    if (!q) return undefined;
    const handle = setTimeout(() => {
      trackSearchPerformed({
        query_length: q.length,
        results_count: results.length,
        has_results: results.length > 0,
      });
    }, 600);
    return () => clearTimeout(handle);
  }, [query, results.length]);

  const pagedResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, page]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);

  const handleClick = (path, q, rank) => {
    const slug = (path || '').split('/').pop().toLowerCase();
    trackSearchResultClicked({
      result_chapter: slug || 'unknown',
      result_rank: rank,
    });
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
              onClick={() => handleClick(item.path, query, (page - 1) * PAGE_SIZE + idx + 1)}
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
  const highlight = (text, q) => {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return text;

    return (
      <>
        {text.substring(0, i)}
        <mark>{text.substring(i, i + q.length)}</mark>
        {text.substring(i + q.length)}
      </>
    );
  };
  return (
    <div className="result-item" onClick={onClick}>
      <h4>{item.label}</h4>
      <p>{highlight(item.excerpt, query)}</p>
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
