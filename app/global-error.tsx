'use client';
/** Last-resort screen for an uncaught error at the root. Shows the real message so a phone report is actionable. */
export default function GlobalError({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
 return <html lang="en"><body style={{margin:0,padding:'28px',background:'#0A0B10',color:'#fff',font:'16px/1.5 system-ui,sans-serif'}}>
  <h1 style={{fontSize:'1.4rem',margin:'0 0 8px'}}>PDF Studio hit a problem</h1>
  <p style={{opacity:.85}}>Reload to try again. If it keeps happening, email pdf.studio.in@gmail.com with the line below.</p>
  <p style={{font:'12px/1.5 ui-monospace,monospace',opacity:.75,wordBreak:'break-all'}}>{String(error?.message||'unknown').slice(0,300)}{error?.digest?` (${error.digest})`:''}</p>
  <button onClick={()=>{reset();window.location.reload();}} style={{minHeight:48,padding:'0 24px',border:0,borderRadius:10,font:'600 16px system-ui'}}>Reload</button>
 </body></html>;
}
