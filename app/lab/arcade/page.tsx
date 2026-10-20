import Link from '@/components/browser-link';
import {ArcadeDirectory} from '@/components/arcade-directory';
import {pageMeta} from '@/lib/page-meta';
import './arcade.css';
import './club.css';
export const metadata=pageMeta('/lab/arcade','Studio Arcade — 60 free browser games','Basketball, mini golf, chess, checkers, Ludo, word games and arcade favourites. Free touch and keyboard games. No login.');
export default function Arcade(){return <div className="arcade-shell"><main className="arcade-main"><Link className="arcade-back" href="/lab">← Back to Studio Lab</Link><ArcadeDirectory/></main></div>;}
