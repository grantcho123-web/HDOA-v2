'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';

const PLATFORMS = ["Outlier AI","Scale AI","DataAnnotation.tech","Mercor","Mindrift (Toloka)","TELUS Digital AI","Appen","Surge AI","Micro1","Alignerr","Welocalize","OneForma","RWS","LXT AI","TransPerfect","Toloka","Amazon Mechanical Turk","Clickworker","Prolific","Braintrust","Turing","CloudFactory","Sama","iMerit"];

function Stars({ value, onChange, size }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={() => onChange && onChange(n)} style={{ fontSize:size||18, cursor:onChange?'pointer':'default', color:n<=value?'#fcd34d':'#52525b' }}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { user, isSignedIn } = useUser();
  const [reviews, setReviews] = useState([]);
  const [platform, setPlatform] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ platform:'Outlier AI', rating:5, title:'', body:'', pros:'', cons:'', hourly_pay:'', hours_per_week:'', role_type:'' });

  useEffect(() => { loadReviews(); }, [platform]);

  async function loadReviews() {
    setLoading(true);
    const url = platform === 'All' ? '/api/reviews' : `/api/reviews?platform=${encodeURIComponent(platform)}`;
    const res = await fetch(url);
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function submitReview(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ ...form, hourly_pay: form.hourly_pay ? parseFloat(form.hourly_pay) : null, hours_per_week: form.hours_per_week ? parseInt(form.hours_per_week) : null }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ platform:'Outlier AI', rating:5, title:'', body:'', pros:'', cons:'', hourly_pay:'', hours_per_week:'', role_type:'' });
      loadReviews();
    } else {
      const err = await res.json();
      alert('Error: ' + (err.error || 'Failed to submit'));
    }
    setSubmitting(false);
  }

  // Calculate platform stats
  const stats = {};
  reviews.forEach(r => {
    if (!stats[r.platform]) stats[r.platform] = { total:0, sum:0, paySum:0, payCount:0 };
    stats[r.platform].total++;
    stats[r.platform].sum += r.rating;
    if (r.hourly_pay) { stats[r.platform].paySum += parseFloat(r.hourly_pay); stats[r.platform].payCount++; }
  });

  const S = { card:'rgba(22,22,26,.9)', border:'rgba(255,255,255,.05)', green:'#34d399', text:'#f4f4f5', dim:'#a1a1aa', muted:'#71717a', subtle:'#52525b' };
  const input = { width:'100%', padding:'8px 12px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:8, fontSize:13, color:S.text, outline:'none', fontFamily:'inherit' };

  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,rgba(251,191,36,.08),rgba(251,113,133,.08))', border:'1px solid rgba(251,191,36,.12)', borderRadius:14, padding:20, marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, color:'white', marginBottom:4 }}>⭐ Platform Reviews</h2>
            <p style={{ fontSize:13, color:S.dim }}>Real ratings from AI trainers. {reviews.length} review{reviews.length!==1?'s':''} and counting.</p>
          </div>
          {isSignedIn ? (
            <button onClick={() => setShowForm(!showForm)} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid rgba(52,211,153,.2)', background:'rgba(52,211,153,.1)', color:'#6ee7b7', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              {showForm ? '✕ Cancel' : '✍️ Write a Review'}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button style={{ padding:'8px 16px', borderRadius:8, border:'1px solid rgba(52,211,153,.2)', background:'rgba(52,211,153,.1)', color:'#6ee7b7', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Sign in to review</button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={submitReview} style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:12, padding:20, marginBottom:20 }}>
          <h3 style={{ fontSize:15, fontWeight:600, color:S.text, marginBottom:14 }}>Write Your Review</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Platform</label>
              <select value={form.platform} onChange={e => setForm(f=>({...f, platform:e.target.value}))} style={{ ...input, cursor:'pointer' }}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Role Type</label>
              <select value={form.role_type} onChange={e => setForm(f=>({...f, role_type:e.target.value}))} style={{ ...input, cursor:'pointer' }}>
                <option value="">Select...</option>
                {['Coding','Writing','STEM','Medical','Legal','Finance','Linguistics','Search/Ads','Generalist','Other'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Overall Rating</label>
            <Stars value={form.rating} onChange={v => setForm(f=>({...f, rating:v}))} size={28} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Actual Hourly Pay ($)</label>
              <input type="number" step="0.01" placeholder="e.g. 35" value={form.hourly_pay} onChange={e => setForm(f=>({...f, hourly_pay:e.target.value}))} style={input} />
            </div>
            <div>
              <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Hours Per Week</label>
              <input type="number" placeholder="e.g. 20" value={form.hours_per_week} onChange={e => setForm(f=>({...f, hours_per_week:e.target.value}))} style={input} />
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Review Title</label>
            <input type="text" placeholder="Summarize your experience" value={form.title} onChange={e => setForm(f=>({...f, title:e.target.value}))} style={input} required />
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Your Review</label>
            <textarea placeholder="What was your experience like?" value={form.body} onChange={e => setForm(f=>({...f, body:e.target.value}))} rows={4} style={{ ...input, resize:'vertical' }} required />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <div>
              <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Pros</label>
              <textarea placeholder="What was good?" value={form.pros} onChange={e => setForm(f=>({...f, pros:e.target.value}))} rows={2} style={{ ...input, resize:'vertical' }} />
            </div>
            <div>
              <label style={{ fontSize:11, color:S.muted, display:'block', marginBottom:4 }}>Cons</label>
              <textarea placeholder="What could be better?" value={form.cons} onChange={e => setForm(f=>({...f, cons:e.target.value}))} rows={2} style={{ ...input, resize:'vertical' }} />
            </div>
          </div>
          <button type="submit" disabled={submitting} style={{ padding:'10px 20px', borderRadius:8, border:'none', background:S.green, color:'#0a0a0c', fontSize:13, fontWeight:700, cursor:submitting?'not-allowed':'pointer', fontFamily:'inherit', opacity:submitting?.6:1 }}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Platform filter */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
        <button onClick={() => setPlatform('All')} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${platform==='All'?'rgba(52,211,153,.2)':'rgba(255,255,255,.05)'}`, background:platform==='All'?'rgba(52,211,153,.1)':'transparent', color:platform==='All'?'#6ee7b7':'#a1a1aa', fontSize:11, fontWeight:platform==='All'?600:400, cursor:'pointer', fontFamily:'inherit' }}>All</button>
        {PLATFORMS.map(p => (
          <button key={p} onClick={() => setPlatform(p)} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${platform===p?'rgba(52,211,153,.2)':'rgba(255,255,255,.05)'}`, background:platform===p?'rgba(52,211,153,.1)':'transparent', color:platform===p?'#6ee7b7':'#a1a1aa', fontSize:11, fontWeight:platform===p?600:400, cursor:'pointer', fontFamily:'inherit' }}>{p}</button>
        ))}
      </div>

      {/* Reviews list */}
      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:S.dim }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:S.dim }}>
          <p style={{ fontSize:32, marginBottom:8 }}>⭐</p>
          <p style={{ fontSize:14 }}>No reviews yet{platform !== 'All' ? ` for ${platform}` : ''}.</p>
          <p style={{ fontSize:12, marginTop:4 }}>Be the first to share your experience!</p>
        </div>
      ) : (
        <div>
          {reviews.map(r => (
            <div key={r.id} style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:10, padding:16, marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:10, color:S.subtle, textTransform:'uppercase', fontWeight:600, marginBottom:2 }}>{r.platform}{r.role_type && ` · ${r.role_type}`}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:S.text }}>{r.title}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <Stars value={r.rating} size={14} />
                  {r.hourly_pay && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:S.green, marginTop:2 }}>${r.hourly_pay}/hr</div>}
                </div>
              </div>
              {r.body && <p style={{ fontSize:12, color:S.dim, lineHeight:1.5, marginBottom:8 }}>{r.body}</p>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {r.pros && <div style={{ fontSize:11, color:'#6ee7b7' }}>👍 {r.pros}</div>}
                {r.cons && <div style={{ fontSize:11, color:'#fda4af' }}>👎 {r.cons}</div>}
              </div>
              <div style={{ fontSize:10, color:S.subtle, marginTop:8 }}>
                {r.hours_per_week && `${r.hours_per_week}h/week · `}{new Date(r.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
