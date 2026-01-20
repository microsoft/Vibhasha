import React, { useEffect, useRef, useState } from 'react';
import './styles/Search.css';

function escapeRegExp(str){
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function PageSearch({ containerSelector = '.intro-root', placeholder = 'Search' }){
  const [q, setQ] = useState('');
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const formRef = useRef(null);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Remove previous highlights
    container.querySelectorAll('span.search-highlight').forEach(span => {
      const text = span.textContent;
      const parent = span.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(text), span);
      parent.normalize();
    });

    if (!q.trim()){
      setCount(0);
      setIndex(0);
      return;
    }

    const re = new RegExp(escapeRegExp(q.trim()), 'gi');
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const val = node.nodeValue || '';
        if (!val.trim()) return NodeFilter.FILTER_REJECT;
        const p = node.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName || '';
        if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())){
      const val = node.nodeValue || '';
      const matches = [...val.matchAll(re)];
      if (!matches.length) continue;
      let lastIndex = 0;
      const frag = document.createDocumentFragment();
      matches.forEach(m => {
        const start = m.index || 0;
        const end = start + (m[0]?.length || 0);
        frag.appendChild(document.createTextNode(val.slice(lastIndex, start)));
        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = val.slice(start, end);
        frag.appendChild(span);
        lastIndex = end;
      });
      frag.appendChild(document.createTextNode(val.slice(lastIndex)));
      node.parentNode.replaceChild(frag, node);
    }

    const highlights = container.querySelectorAll('span.search-highlight');
    setCount(highlights.length);
    if (highlights.length){
      const i = Math.max(0, Math.min(index, highlights.length - 1));
      setIndex(i);
      highlights.forEach(h => h.classList.remove('active'));
      const current = highlights[i];
      if (current){
        current.classList.add('active');
        current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [q]);

  function onSubmit(e){
    e.preventDefault();
  }

//   function next(){
//     const container = document.querySelector(containerSelector);
//     const highlights = container ? container.querySelectorAll('span.search-highlight') : [];
//     if (!highlights.length) return;
//     const i = (index + 1) % highlights.length;
//     setIndex(i);
//     highlights.forEach(h => h.classList.remove('active'));
//     const current = highlights[i];
//     current.classList.add('active');
//     current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//   }

//   function prev(){
//     const container = document.querySelector(containerSelector);
//     const highlights = container ? container.querySelectorAll('span.search-highlight') : [];
//     if (!highlights.length) return;
//     const i = (index - 1 + highlights.length) % highlights.length;
//     setIndex(i);
//     highlights.forEach(h => h.classList.remove('active'));
//     const current = highlights[i];
//     current.classList.add('active');
//     current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//   }

//   function clear(){
//     setQ('');
//   }

  return (
    <form ref={formRef} className="hero-search" role="search" aria-label="Page search" onSubmit={onSubmit}>
      <input
        type="search"
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {/* <button type="button" className="search-btn" onClick={prev}>Prev</button>
      <button type="button" className="search-btn" onClick={next}>Next</button>
      <button type="button" className="search-btn" onClick={clear}>Clear</button>
      <span className="search-meta" aria-live="polite">{count ? `${index+1}/${count}` : '0 results'}</span> */}
    </form>
  );
}
