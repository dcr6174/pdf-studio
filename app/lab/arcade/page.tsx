import '@/components/arcade-garden.css';
import Link from '@/components/browser-link';
import {ArcadeDirectory} from '@/components/arcade-directory';
import {ArcadeHub} from '@/components/arcade-hub';
import {pageMeta} from '@/lib/page-meta';
import {PublicDirectory} from '@/components/public-directory';
import {activeArcadeGames} from '@/lib/arcade-active';
import './arcade.css';
import './club.css';
import './fresh.css';
import './expansion.css';
import './quality.css';
import './play-home.css';
export const metadata=pageMeta('/lab/arcade','Play Studio — 100 free mini games','100 free original touch-friendly mini games: cricket, volleyball, 8-ball pool, racing, endless runners, satisfying puzzles, chess and more. Free touch and keyboard games. No login.');
export default function Arcade(){return <div className="arcade-shell"><main className="arcade-main"><Link className="arcade-back" href="/lab">← Back to Studio Lab</Link><ArcadeHub/><ArcadeDirectory/><PublicDirectory title="Browse all Play Studio games" entries={activeArcadeGames.map(game=>({path:'/lab/arcade/'+game.slug,title:game.name}))}/></main></div>;}

