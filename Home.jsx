import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '40px clamp(24px,4vw,48px)' }}>
      <section style={{ maxWidth: 840, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0 }}>Welcome</h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
          Explore the <strong>Speech AI Playbook</strong> using the navigation above. You'll find practical guidance for
          dataset creation, model finetuning strategies, inference optimization and more. Use the sidebar inside the
          playbook pages for deep section jumps, or the next/previous buttons at the bottom of each page to read linearly.
        </p>
        <p style={{ fontSize: '.9rem', opacity: .75 }}>Tip: Toggle the theme for a different viewing experience.</p>
      </section>
    </div>
  );
}
