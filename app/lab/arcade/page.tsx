import Link from '@/components/browser-link';
import {ArcadeDirectory} from '@/components/arcade-directory';
import {pageMeta} from '@/lib/page-meta';
import './arcade.css';
export const metadata=pageMeta('/lab/arcade','Studio Arcade — 10 free browser games','Take a quick break with Buddy Stack, Paper Toss, 2048, Snake, Memory Match and more. Free games with touch and keyboard controls. No login.');
export default function Arcade(){return <div className="arcade-shell"><main className="arcade-main"><Link className="arcade-back" href="/lab">← Back to Studio Lab</Link><ArcadeDirectory/></main></div>;}
