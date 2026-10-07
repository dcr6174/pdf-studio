'use client';
import Link from 'next/link';
export default function ToolError({reset}:{reset:()=>void}){return <main className="seo-page"><h1>This tool could not load</h1><p>A recent update or network interruption may have prevented a tool file from loading. Try again. If it still fails, reload this page to get the current version.</p><button className="primary" onClick={()=>reset()}>Try again</button><button className="secondary" onClick={()=>window.location.reload()}>Reload tool</button><p><Link href="/tools">Browse tools</Link> · <Link href="/help">Get help</Link></p></main>;}
