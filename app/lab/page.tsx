import {SiteHeader,SiteFooter} from '@/components/site-header';
import {LabDirectory} from '@/components/lab-directory';
import {LabShowcase} from '@/components/lab-showcase';
import {pageMeta} from '@/lib/page-meta';
import {PublicDirectory} from '@/components/public-directory';
import {labTools} from '@/lib/handwriting';
import {experiments} from '@/lib/lab-tools';
import {utilityTools} from '@/lib/lab-utilities';
import {printableTools} from '@/lib/lab-printables';
import {funTools} from '@/lib/fun-lab';
import {imageTools} from '@/lib/image-tools';
import '../creative/creative.css';
import './lab.css';
import './discovery.css';
import './showcase.css';
export const metadata=pageMeta('/lab','Studio Lab — Image Studio, Play Studio and creative tools','Edit images, play 100 free mini games and create printables in one beautiful space. Discover quick image tools, intuitive touch games and creative ideas.');
export default function Lab(){
 const entries=[...labTools,...experiments,...utilityTools,...printableTools,...funTools,...imageTools].map(tool=>({path:'/lab/'+tool.slug,title:tool.title}));
 entries.push({path:'/lab/arcade',title:'Play Studio — all games'},{path:'/lab/image-studio',title:'Image Studio'},{path:'/lab/remove-watermark',title:'Remove Watermark'},{path:'/lab/daily-mood-canvas',title:'Daily mood canvas'});
 return <div className="creative-shell lab-home"><SiteHeader/><main className="lab-home-main"><LabShowcase/><LabDirectory/><PublicDirectory title="Browse every Studio Lab tool" entries={entries}/></main><SiteFooter/></div>;
}
