'use client';

import { useState, useEffect } from 'react';

const POSTS = [
  {
    slug: 'how-to-earn-50-per-hour-training-ai',
    title: 'How to Earn $50+/Hour Training AI in 2026',
    excerpt: 'A complete guide to landing premium AI training gigs — which platforms pay the most, what skills you need, and how to stand out.',
    date: '2026-03-12',
    tags: ['Guide', 'Earnings'],
    readTime: '8 min',
  },
  {
    slug: 'best-ai-training-platforms-compared',
    title: 'Best AI Training Platforms Compared: 41 Companies Ranked',
    excerpt: 'We analyzed pay rates, availability, and work quality across every major AI training platform. Here are the results.',
    date: '2026-03-12',
    tags: ['Comparison', 'Rankings'],
    readTime: '12 min',
  },
  {
    slug: 'getting-started-no-experience',
    title: 'Getting Started in AI Training With Zero Experience',
    excerpt: 'No PhD? No problem. These entry-level platforms hire generalists and pay $15-25/hour for tasks anyone can learn.',
    date: '2026-03-12',
    tags: ['Beginner', 'Guide'],
    readTime: '6 min',
  },
  {
    slug: 'phd-stem-ai-training-guide',
    title: 'PhD & STEM Grads: Your Expertise Is Worth $100+/Hour',
    excerpt: 'Medical doctors, lawyers, PhDs in physics — frontier AI labs are paying premium rates for domain expertise. Here is how to get in.',
    date: '2026-03-12',
    tags: ['Premium', 'STEM'],
    readTime: '7 min',
  },
  {
    slug: 'multilingual-ai-trainer-opportunities',
    title: 'Speak Another Language? These Platforms Pay $15-40/Hour',
    excerpt: 'AI companies need native speakers of 38+ languages for translation, evaluation, and cultural adaptation work.',
    date: '2026-03-12',
    tags: ['Languages', 'Global'],
    readTime: '5 min',
  },
  {
    slug: 'ai-training-taxes-freelancer-guide',
    title: 'AI Trainer Tax Guide: What Freelancers Need to Know',
    excerpt: 'Self-employment tax, quarterly payments, deductions — everything you need to know about taxes as an AI trainer.',
    date: '2026-03-12',
    tags: ['Taxes', 'Finance'],
    readTime: '10 min',
  },
];

const tagColors = { Guide:'green', Earnings:'green', Comparison:'sky', Rankings:'sky', Beginner:'amber', Premium:'violet', STEM:'violet', Languages:'sky', Global:'sky', Taxes:'amber', Finance:'amber' };
const colors = { green:{ bg:'rgba(52,211,153,.1)', c:'#6ee7b7', bc:'rgba(52,211,153,.15)' }, sky:{ bg:'rgba(56,189,248,.1)', c:'#7dd3fc', bc:'rgba(56,189,248,.15)' }, amber:{ bg:'rgba(251,191,36,.1)', c:'#fcd34d', bc:'rgba(251,191,36,.15)' }, violet:{ bg:'rgba(167,139,250,.1)', c:'#c4b5fd', bc:'rgba(167,139,250,.15)' } };

export default function BlogPage() {
  const [tag, setTag] = useState('All');
  const allTags = [...new Set(POSTS.flatMap(p => p.tags))];
  const filtered = tag === 'All' ? POSTS : POSTS.filter(p => p.tags.includes(tag));

  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,rgba(167,139,250,.08),rgba(251,191,36,.08))', border:'1px solid rgba(167,139,250,.12)', borderRadius:14, padding:20, marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'white', marginBottom:4 }}>📝 Blog & Guides</h2>
        <p style={{ fontSize:13, color:'#a1a1aa' }}>Strategies, comparisons, and tips for maximizing your AI training income.</p>
      </div>

      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:20 }}>
        <button onClick={() => setTag('All')} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${tag==='All'?'rgba(52,211,153,.2)':'rgba(255,255,255,.05)'}`, background:tag==='All'?'rgba(52,211,153,.1)':'transparent', color:tag==='All'?'#6ee7b7':'#a1a1aa', fontSize:11, fontWeight:tag==='All'?600:400, cursor:'pointer', fontFamily:'inherit' }}>All</button>
        {allTags.map(t => (
          <button key={t} onClick={() => setTag(t)} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${tag===t?'rgba(52,211,153,.2)':'rgba(255,255,255,.05)'}`, background:tag===t?'rgba(52,211,153,.1)':'transparent', color:tag===t?'#6ee7b7':'#a1a1aa', fontSize:11, fontWeight:tag===t?600:400, cursor:'pointer', fontFamily:'inherit' }}>{t}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:12 }}>
        {filtered.map(post => (
          <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration:'none' }}>
            <div style={{ background:'rgba(22,22,26,.9)', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, padding:18, height:'100%', transition:'border-color .2s' }} onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,.12)'} onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,.05)'}>
              <div style={{ display:'flex', gap:4, marginBottom:8 }}>
                {post.tags.map(t => { const c = colors[tagColors[t]] || colors.green; return <span key={t} style={{ padding:'2px 7px', fontSize:10, borderRadius:4, border:`1px solid ${c.bc}`, background:c.bg, color:c.c }}>{t}</span>; })}
              </div>
              <h3 style={{ fontSize:15, fontWeight:600, color:'#f4f4f5', lineHeight:1.3, marginBottom:6 }}>{post.title}</h3>
              <p style={{ fontSize:12, color:'#a1a1aa', lineHeight:1.5, marginBottom:10 }}>{post.excerpt}</p>
              <div style={{ fontSize:10, color:'#52525b' }}>{post.date} · {post.readTime} read</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
