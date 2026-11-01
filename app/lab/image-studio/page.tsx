import {StudioNavigation} from '@/components/studio-navigation';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import Link from '@/components/browser-link';
import {ArrowRight,Camera,Crop,LockKeyhole,Palette,RefreshCw,Sparkles,SlidersHorizontal,Zap} from 'lucide-react';
import {imageTools} from '@/lib/image-tools';
import {pageMeta} from '@/lib/page-meta';
import '../../creative/creative.css';
import '../showcase.css';
import './image-studio.css';
export const metadata=pageMeta('/lab/image-studio','Image Studio — simple free photo tools','Explore easy image compression, resizing, cropping, background removal, photo conversions, color tools and creative images.');
const sets=[
 {id:'Optimize',icon:Zap,title:'Make images lighter',description:'Reduce file size without complicated settings.'},
 {id:'Edit',icon:Crop,title:'Refine every detail',description:'Crop, resize and adjust your favourite images.'},
 {id:'Convert',icon:RefreshCw,title:'The format you need',description:'Switch images between common web and document-friendly formats.'},
 {id:'Protect',icon:LockKeyhole,title:'Keep control of the details',description:'Remove image metadata or add a watermark.'},
 {id:'Create',icon:Palette,title:'Make something new',description:'Photos, contact sheets, icons and colourful projects.'}
] as const;
export default function ImageStudio(){return <div className="creative-shell lab-home lab-image-hub"><SiteHeader/><StudioNavigation active="images"/><main className="image-hub-main"><header className="image-hub-hero"><div><span className="lab-hero-eyebrow"><Sparkles size={17}/> IMAGE STUDIO · YOUR PHOTOS, YOUR WAY</span><h1>Make every image <em>look its best.</em></h1><p>Crop a memory. Resize for a form. Make a picture lighter, brighter or ready to share. Pick a tool, upload a photo and see the result.</p><div className="image-hub-tags"><span>{imageTools.length} useful image tools</span><span>Simple previews</span><span>No sign-in needed</span></div><a href="#image-hub-tools" className="image-hub-cta">Explore image tools <ArrowRight size={18}/></a></div><div className="image-hub-visual" aria-hidden="true"><div className="image-hub-halo"/><div className="image-hub-card back"/><div className="image-hub-card front"><div className="image-hub-sun"/><div className="image-hub-mountains"/><div className="image-hub-water"/></div><span className="image-hub-slider"><SlidersHorizontal size={22}/> Adjust · 84%</span><span className="image-hub-magic">✦</span></div></header>
 <section className="image-hub-popular" aria-label="Get started"><span>QUICK START</span><div>{[['image-compressor','Compress image'],['image-resizer','Resize image'],['image-background-remover','Remove plain background'],['passport-photo','Passport photo sheet']].map(([slug,title])=><Link key={slug} href={'/lab/'+slug}>{title}<ArrowRight size={16}/></Link>)}</div></section>
 <section className="image-hub-tools" id="image-hub-tools"><div className="image-hub-heading"><span>ALL THE ESSENTIALS</span><h2>What do you want to do?</h2><p>Every tool below opens its own focused workspace.</p></div>
 {sets.map(set=>{const Icon=set.icon;const matches=imageTools.filter(tool=>tool.category===set.id);return <section key={set.id} className="image-hub-section" aria-labelledby={'image-'+set.id}><div className="image-hub-section-head"><div className="image-hub-section-icon"><Icon size={22}/></div><div><h3 id={'image-'+set.id}>{set.title}</h3><p>{set.description}</p></div><span>{matches.length} tools</span></div><div className="image-hub-grid">{matches.map(tool=><Link key={tool.slug} href={'/lab/'+tool.slug} className="image-hub-tool"><div><strong>{tool.title}</strong><p>{tool.description}</p></div><ArrowRight size={19}/></Link>)}</div></section>})}
 </section><footer className="image-hub-footer"><Camera size={21}/><p>Choose a tool, edit your image, then save a copy. <Link href="/lab/guides">Browse step-by-step image guides →</Link></p></footer></main><SiteFooter/></div>}
