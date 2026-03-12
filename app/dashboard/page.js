'use client';

import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div style={{ textAlign:'center', padding:60, color:'#71717a' }}>Loading...</div>;

  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,rgba(52,211,153,.08),rgba(56,189,248,.08))', border:'1px solid rgba(52,211,153,.12)', borderRadius:14, padding:24, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {user.imageUrl && <img src={user.imageUrl} alt="" style={{ width:48, height:48, borderRadius:12 }} />}
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, color:'white' }}>Welcome, {user.firstName || 'there'}</h2>
            <p style={{ fontSize:13, color:'#a1a1aa' }}>{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        <div style={{ background:'rgba(22,22,26,.9)', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, padding:16, textAlign:'center' }}>
          <div style={{ fontSize:24 }}>⭐</div>
          <div style={{ fontSize:28, fontWeight:700, color:'#34d399', marginTop:4 }}>0</div>
          <div style={{ fontSize:11, color:'#71717a' }}>Reviews Written</div>
        </div>
        <div style={{ background:'rgba(22,22,26,.9)', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, padding:16, textAlign:'center' }}>
          <div style={{ fontSize:24 }}>📋</div>
          <div style={{ fontSize:28, fontWeight:700, color:'#7dd3fc', marginTop:4 }}>0</div>
          <div style={{ fontSize:11, color:'#71717a' }}>Saved Listings</div>
        </div>
        <div style={{ background:'rgba(22,22,26,.9)', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, padding:16, textAlign:'center' }}>
          <div style={{ fontSize:24 }}>🔔</div>
          <div style={{ fontSize:28, fontWeight:700, color:'#c4b5fd', marginTop:4 }}>0</div>
          <div style={{ fontSize:11, color:'#71717a' }}>Alerts Active</div>
        </div>
      </div>

      <p style={{ fontSize:12, color:'#52525b', marginTop:20, textAlign:'center' }}>
        Recruiter dashboard, reviews, and alerts coming soon.
      </p>
    </div>
  );
}
