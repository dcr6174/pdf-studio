import {SiteHeader,SiteFooter} from '@/components/site-header';
import {labTools} from '@/lib/handwriting';
import {pageMeta} from '@/lib/page-meta';
import {PenLine,BookOpen,NotebookPen} from 'lucide-react';
import '../creative/creative.css';
import Link from '@/components/browser-link';
export const metadata=pageMeta('/lab','Studio Lab — creative and experimental tools','Create handwritten-style PDFs, convert selectable PDF text, print notebook paper and make handwriting practice sheets. Free, on-device tools.');
const icons=[PenLine,BookOpen,NotebookPen];
export default function Creative(){return <div className="creative-shell"><SiteHeader/><main className="creative-hub"><span className="creative-eyebrow">Studio Lab · Beta</span><h1>A little more creative.</h1><p>Explore creative and experimental tools: handwritten notes, printable notebooks and practice sheets. All run in your browser, without an account.</p><div className="creative-grid">{labTools.map((tool,i)=>{const Icon=icons[i];return <a key={tool.slug} href={'/lab/'+tool.slug}><span className={'creative-icon creative-icon-'+i}><Icon size={28}/></span><h2>{tool.title}</h2><p>{tool.description}</p><span>Open tool →</span></a>;})}</div><section><h2>One notebook. Your own style.</h2><p>Choose from 20 licensed handwriting styles or import your own font. Inspect the actual PDF before downloading.</p><p>Looking for PDF to handwriting? Find it in the main PDF tools. It extracts selectable text and reflows it onto new paper; source layouts and handwritten scans are not reconstructed.</p><Link href="/tools/pdf-to-handwriting">Open PDF to handwriting →</Link></section></main><SiteFooter/></div>;}
