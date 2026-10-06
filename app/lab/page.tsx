import {SiteHeader,SiteFooter} from '@/components/site-header';
import {LabDirectory} from '@/components/lab-directory';
import {pageMeta} from '@/lib/page-meta';
import Link from '@/components/browser-link';
import '../creative/creative.css';
import './lab.css';
export const metadata=pageMeta('/lab','Studio Lab — creative and experimental PDF tools','Explore PDF flipbooks, word clouds, page palettes, a whiteboard and handwriting tools. Free browser experiments.');
export default function Lab(){return <div className="creative-shell"><SiteHeader/><main className="creative-hub"><span className="creative-eyebrow">Studio Lab · Beta</span><h1>A little more creative.</h1><p>Explore playful ways to work with your PDFs. Try a browser experiment, inspect the result and download it.</p><LabDirectory/><section><h2>Looking for PDF to handwriting?</h2><p>It lives in the main PDF tools. Selectable PDF text becomes handwritten-style notes, with a live preview and licensed fonts.</p><Link href="/tools/pdf-to-handwriting">Open PDF to handwriting →</Link></section></main><SiteFooter/></div>;}
