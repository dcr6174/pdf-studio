import type {Metadata} from 'next';
import Link from 'next/link';
export const metadata:Metadata={title:'Offline - PDF Studio',description:'PDF Studio works offline for pages you have already opened.',robots:{index:false}};
export default function OfflinePage(){
 return <main className="content-page" style={{maxWidth:'34rem',margin:'0 auto',padding:'20vh 1.25rem 4rem',textAlign:'center'}}>
  <h1 style={{fontSize:'1.6rem',margin:'0 0 .75rem'}}>You are offline</h1>
  <p style={{color:'var(--foreground)',opacity:.8,lineHeight:1.6}}>PDF Studio keeps working without internet for tools you have opened before. This page has not loaded yet, so it needs a connection once.</p>
  <p style={{marginTop:'1.5rem'}}><Link href="/" style={{color:'#5145CD',fontWeight:600}}>Back to all tools</Link></p>
 </main>;
}
