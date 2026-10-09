import {SiteHeader,SiteFooter} from '@/components/site-header';
import {LabDirectory} from '@/components/lab-directory';
import {pageMeta} from '@/lib/page-meta';
import Link from '@/components/browser-link';
import {Sparkles,ArrowDown} from 'lucide-react';
import '../creative/creative.css';
import './lab.css';
import './discovery.css';
export const metadata=pageMeta('/lab','Studio Lab — make, learn and play','Twelve practical and playful tools for photo strips, study flashcards, printables, creative canvases and focused breaks.');
export default function Lab(){return <div className="creative-shell lab-home"><SiteHeader/><main className="lab-home-main"><header className="lab-cinematic-hero"><div className="lab-morphs" aria-hidden="true"><i/><i/><i/></div><div className="lab-hero-copy"><span className="lab-kicker"><Sparkles size={16} aria-hidden="true"/>Studio Lab</span><h1>A little useful.<br/><em>A lot of possibility.</em></h1><p>Make something, learn something, or just enjoy a small creative break. Pick a tool and get straight to it.</p><Link href="#lab-tools-heading" className="lab-hero-link">Explore the collection <ArrowDown size={17} aria-hidden="true"/></Link></div><div className="lab-paper-scene" aria-hidden="true"><div className="lab-paper lab-paper-back"><span>MAKE</span><i/><i/><i/></div><div className="lab-paper lab-paper-middle"><span>LEARN</span><b>Aa</b><i/></div><div className="lab-paper lab-paper-front"><span>PLAY</span><b>✦</b><p>Make a little magic.</p></div></div></header><LabDirectory/></main><SiteFooter/></div>;}
