import Link from '@/components/browser-link';
import {ArcadeDirectory} from '@/components/arcade-directory';
import {pageMeta} from '@/lib/page-meta';
import './arcade.css';
export const metadata=pageMeta('/lab/arcade','Studio Arcade — 37 free browser games','Word games, crosswords, Sudoku, picture puzzles and ten arcade favourites. Free touch and keyboard games. No login.');
export default function Arcade(){return <div className="arcade-shell"><main className="arcade-main"><Link className="arcade-back" href="/lab">← Back to Studio Lab</Link><ArcadeDirectory/></main></div>;}
