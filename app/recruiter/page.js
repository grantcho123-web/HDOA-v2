'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function RecruiterPage() {
  const { user } = useUser();
  const [applicants, setApplicants] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (!user) return;
    supabase.from('applicants').select('*').eq('recruiter_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setApplicants(data || []));
  }, [user]);

  async function updateStatus(id, status) {
    await supabase.from('applicants').update({ status }).eq('id', id);
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  async function deleteApplicant(id) {
    await supabase.from('applicants').delete().eq('id', id);
    setApplicants(prev => prev.filter(a => a.id !== id));
  }

  function exportCSV() {
    const rows = filtered.map(a => [a.name, a.email, a.country, (a.skills||[]).join(';'), a.status].join(','));
    const csv = 'Name,Email,Country,Skills,Status\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'applicants.csv'; a.click();
  }

  const filtered = applicants.filter(a => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (a.name||'').toLowerCase().includes(s) || (a.email||'').toLowerCase().includes(s) || (a.skills||[]).some(sk => sk.toLowerCase().includes(s));
    }
    return true;
  });

  const statusColors = { new:'#7dd3fc', contacted:'#fcd34d', interviewing:'#c4b5fd', hired:'#6ee7b7', rejected:'#fda4af' };

  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,rgba(167,139,250,.08),rgba(56,189,248,.08))', border:'1px solid rgba(167,139,250,.12)', borderRadius:14, padding:20, marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'white', marginBottom:4 }}>Recruiter Dashboard</h2>
        <p style={{ fontSize:13, color:'#a1a1aa' }}>Manage candidates. Track status, add notes, export data.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
        {[{ l:'Total', v:applicants.length, c:'#f4f4f5' }, { l:'New', v:applicants.filter(a=>a.status==='new').length, c:'#7dd3fc' }, { l:'Contacted', v:applicants.filter(a=>a.status==='contacted').length, c:'#fcd34d' }, { l:'Hired', v:applicants.filter(a=>a.status==='hired').length, c:'#6ee7b7' }].map(s =>
          <div key={s.l} style={{ background:'rgba(22,22,26,.9)', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, padding:14, textAlign:'center' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:24, fontWeight:700, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:10, color:'#71717a' }}>{s.l}</div>
          </div>
        )}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <input type="text" placeholder="Search name, email, skill..." value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, padding:'8px 12px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:8, fontSize:12, color:'#f4f4f5', outline:'none', fontFamily:'inherit' }} />
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ padding:'8px 12px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:8, fontSize:12, color:'#a1a1aa', fontFamily:'inherit' }}>
          <option value="All">All Status</option>
          {['new','contacted','interviewing','hired','rejected'].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={exportCSV} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid rgba(52,211,153,.2)', background:'rgba(52,211,153,.1)', color:'#6ee7b7', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Export CSV</button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#a1a1aa' }}>No applicants yet.</div>
      ) : filtered.map(a => (
        <div key={a.id} style={{ background:'rgba(22,22,26,.9)', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, padding:14, marginBottom:8, cursor:'pointer' }} onClick={()=>setExpanded(expanded===a.id?null:a.id)}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <span style={{ fontSize:14, fontWeight:600, color:'#f4f4f5' }}>{a.name||'Unknown'}</span>
              <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, marginLeft:8, background:(statusColors[a.status]||'#71717a')+'20', color:statusColors[a.status]||'#71717a', fontWeight:600 }}>{a.status}</span>
              <div style={{ fontSize:11, color:'#a1a1aa' }}>{a.email}{a.country && ` · ${a.country}`}</div>
            </div>
            <span style={{ fontSize:11, color:'#52525b' }}>{new Date(a.created_at).toLocaleDateString()}</span>
          </div>
          {(a.skills||[]).length > 0 && <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginTop:6 }}>{a.skills.slice(0,6).map(s=><span key={s} style={{ padding:'2px 7px', fontSize:10, borderRadius:4, border:'1px solid rgba(52,211,153,.15)', background:'rgba(52,211,153,.1)', color:'#6ee7b7' }}>{s}</span>)}</div>}
          {expanded===a.id && (
            <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid rgba(255,255,255,.05)' }}>
              {(a.education||[]).map((e,i)=><div key={i} style={{ fontSize:11, color:'#a1a1aa' }}>🎓 {e.degree} {e.major&&`in ${e.major}`} — {e.school}</div>)}
              {(a.experience||[]).map((e,i)=><div key={i} style={{ fontSize:11, color:'#a1a1aa' }}>💼 {e.title} at {e.company}</div>)}
              <div style={{ marginTop:8, display:'flex', gap:4 }}>
                {['new','contacted','interviewing','hired','rejected'].map(s=><button key={s} onClick={ev=>{ev.stopPropagation();updateStatus(a.id,s)}} style={{ padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:'inherit', border:`1px solid ${a.status===s?(statusColors[s]||'#71717a')+'40':'rgba(255,255,255,.06)'}`, background:a.status===s?(statusColors[s]||'#71717a')+'15':'transparent', color:a.status===s?statusColors[s]:'#a1a1aa' }}>{s}</button>)}
              </div>
              <button onClick={ev=>{ev.stopPropagation();deleteApplicant(a.id)}} style={{ marginTop:8, background:'rgba(251,113,133,.1)', border:'1px solid rgba(251,113,133,.15)', borderRadius:6, padding:'4px 10px', fontSize:10, color:'#fda4af', cursor:'pointer', fontFamily:'inherit' }}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
