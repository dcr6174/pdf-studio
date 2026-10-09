import {LabArtwork} from '@/components/lab-artwork';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {LabDirectory} from '@/components/lab-directory';
import {pageMeta} from '@/lib/page-meta';
import Link from '@/components/browser-link';
import '../creative/creative.css';
import './lab.css';
export const metadata=pageMeta('/lab','Studio Lab — play, focus, calculate and create','Playful PDF experiments, focus timers, calculators and creative paper tools. Make something unexpected in Studio Lab.');
export default function Lab(){return <div className="creative-shell"><SiteHeader/><main className="creative-hub"><div className="lab-hub-hero"><div><span className="creative-eyebrow">Studio Lab · Beta</span><h1>A little more <span>playful.</span></h1><p>Make something unexpected in Fun & Play, take a focused break, or create something on paper. Explore a different side of PDF Studio.</p></div><div className="lab-hero-art" aria-hidden="true"><i className="lab-art-spark">✦</i><div className="lab-art-card"><LabArtwork/></div><div className="lab-art-letter">Aa</div><i className="lab-art-star">✧</i><span className="lab-art-swoop"/></div></div><LabDirectory/><section><h2>Looking for PDF to handwriting?</h2><p>It lives in the main PDF tools. Selectable PDF text becomes handwritten-style notes, with a live preview and licensed fonts.</p><Link href="/tools/pdf-to-handwriting">Open PDF to handwriting →</Link></section></main><SiteFooter/></div>;}
