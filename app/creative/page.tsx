import {SiteHeader,SiteFooter} from '@/components/site-header';
import {creativeTools} from '@/lib/handwriting';
import {pageMeta} from '@/lib/page-meta';
import {PenLine,FilePenLine,BookOpen,NotebookPen} from 'lucide-react';
import './creative.css';
export const metadata=pageMeta('/creative','Creative tools: handwriting and printable notebooks','Create handwritten-style PDFs, convert selectable PDF text, print notebook paper and make handwriting practice sheets. Free, on-device tools.');
const icons=[PenLine,FilePenLine,BookOpen,NotebookPen];
export default function Creative(){return <div className="creative-shell"><SiteHeader/><main className="creative-hub"><span className="creative-eyebrow">A little room for creativity</span><h1>Make your words feel personal.</h1><p>Handwritten notes, printable notebooks and practice sheets. Create them in your browser, without an account.</p><div className="creative-grid">{creativeTools.map((tool,i)=>{const Icon=icons[i];return <a key={tool.slug} href={'/creative/'+tool.slug}><span className={'creative-icon creative-icon-'+i}><Icon size={28}/></span><h2>{tool.title}</h2><p>{tool.description}</p><span>Open tool →</span></a>;})}</div><section><h2>One notebook. Your own style.</h2><p>Choose from 20 licensed handwriting styles or import your own font. Inspect the actual PDF before downloading.</p><p>PDF import extracts selectable text and reflows it onto new paper. It does not preserve the source layout or recognise handwritten scans.</p></section></main><SiteFooter/></div>;}
