import '@/components/arcade-garden.css';
import {notFound} from 'next/navigation';
import {ArcadeGame} from '@/components/arcade-game';
import {FreshGame} from '@/components/fresh-game';
import {freshGame} from '@/lib/fresh-catalog';
import {expansionGame} from '@/lib/expansion-catalog';
import {activeArcadeGames,isRetiredArcade} from '@/lib/arcade-active';
import {ClubGame} from '@/components/club-game';
import {clubGame} from '@/lib/club-catalog';
import {PuzzleGame} from '@/components/puzzle-game';
import {arcadeGame} from '@/lib/arcade-catalog';
import {puzzleGame} from '@/lib/puzzle-catalog';
import {pageMeta} from '@/lib/page-meta';
import '../arcade.css';
import '../puzzles.css';
import '../club.css';
import '../fresh.css';
import '../expansion.css';
import '../quality.css';
import '../spatial.css';
import '../cricket-play.css';
import '../hill-rider.css';
import '../tenpin.css';
import '../surface-studio.css';
import '../sand-pour.css';
export function generateStaticParams(){return activeArcadeGames.map(game=>({slug:game.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const game=isRetiredArcade(slug)?null:freshGame(slug)??expansionGame(slug)??arcadeGame(slug)??puzzleGame(slug)??clubGame(slug);return game?pageMeta('/lab/arcade/'+game.slug,game.name+' — free in Play Studio',game.description+' '+game.instructions):{};}
export default async function Game({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(isRetiredArcade(slug))notFound();const fresh=freshGame(slug),expansion=expansionGame(slug);if(fresh||expansion)return <div className="arcade-shell"><FreshGame key={slug} slug={slug as NonNullable<typeof fresh|typeof expansion>['slug']}/></div>;const c=clubGame(slug),p=puzzleGame(slug);if(c)return <div className="arcade-shell"><ClubGame key={c.slug} slug={c.slug}/></div>;if(p)return <div className="arcade-shell"><PuzzleGame key={p.slug} slug={p.slug}/></div>;const game=arcadeGame(slug);if(!game)notFound();return <div className="arcade-shell"><ArcadeGame slug={game.slug}/></div>;}
