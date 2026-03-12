import { ClerkProvider, SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'Human Data Ops',
  description: 'AI trainer opportunity aggregator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header style={{ borderBottom:'1px solid rgba(255,255,255,.05)', background:'rgba(10,10,12,.92)', position:'sticky', top:0, zIndex:50 }}>
            <div style={{ maxWidth:1440, margin:'0 auto', padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <a href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#34d399' }}/>
                <span style={{ fontSize:18, fontWeight:700, color:'white' }}>Human Data Ops</span>
              </a>
              <nav style={{ display:'flex', gap:6, alignItems:'center' }}>
                <SignedIn>
                  <a href="/dashboard" style={{ padding:'5px 11px', borderRadius:7, border:'1px solid rgba(52,211,153,.2)', background:'rgba(52,211,153,.1)', color:'#6ee7b7', fontSize:11, fontWeight:600, textDecoration:'none' }}>Dashboard</a>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button style={{ padding:'5px 11px', borderRadius:7, border:'1px solid rgba(52,211,153,.2)', background:'rgba(52,211,153,.1)', color:'#6ee7b7', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Sign In</button>
                  </SignInButton>
                </SignedOut>
              </nav>
            </div>
          </header>
          <main style={{ maxWidth:1440, margin:'0 auto', padding:'14px 20px 40px' }}>{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
