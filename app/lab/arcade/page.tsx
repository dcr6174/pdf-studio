import '@/components/arcade-garden.css';
import Link from '@/components/browser-link';
import {ArcadeDirectory} from '@/components/arcade-directory';
import {pageMeta} from '@/lib/page-meta';
import './arcade.css';
import './club.css';
import './fresh.css';
export const metadata=pageMeta('/lab/arcade','Play Studio — 60 free browser mini games','Cricket, volleyball, 8-ball pool, one-tap sports, puzzle classics, mini golf, chess and word games. Free touch and keyboard games. No login.');
export default function Arcade(){return <div className="arcade-shell"><main className="arcade-main"><Link className="arcade-back" href="/lab">← Back to Studio Lab</Link><ArcadeDirectory/></main></div>;}

