import {SiteHeader,SiteFooter} from '@/components/site-header';
import {LabDirectory} from '@/components/lab-directory';
import {LabShowcase} from '@/components/lab-showcase';
import {pageMeta} from '@/lib/page-meta';
import '../creative/creative.css';
import './lab.css';
import './discovery.css';
import './showcase.css';
export const metadata=pageMeta('/lab','Studio Lab — Image Studio, Play Studio and creative tools','Edit images, play 100 free mini games and create printables in one beautiful space. Discover quick image tools, intuitive touch games and creative ideas.');
export default function Lab(){return <div className="creative-shell lab-home"><SiteHeader/><main className="lab-home-main"><LabShowcase/><LabDirectory/></main><SiteFooter/></div>;}
