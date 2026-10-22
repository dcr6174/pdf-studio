import '@/components/arcade-garden.css';
import {notFound} from 'next/navigation';
import {ArcadeGame} from '@/components/arcade-game';
import {FreshGame} from '@/components/fresh-game';
import {freshGame} from '@/lib/fresh-catalog';
import {activeArcadeGames,isRetiredArcade} from '@/lib/arcade-active';
import {ClubGame} from '@/components/club-game';
import {clubGames,clubGame} from '@/lib/club-catalog';
import {PuzzleGame} from '@/components/puzzle-game';
import {arcadeGames,arcadeGame} from '@/lib/arcade-catalog';
import {puzzleGames,puzzleGame} from '@/lib/puzzle-catalog';
import {pageMeta} from '@/lib/page-meta';
import '../arcade.css';
import '../puzzles.css';
import '../club.css';
import '../fresh.css';
export function generateStaticParams(){return activeArcadeGames.map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params,g=isRetiredArcade(slug)?null:freshGame(slug)??arcadeGame(slug)??puzzleGame(slug)??clubGame(slug);return g?pageMeta('/lab/arcade/'+g.slug,g.name+' — play free in Play Studio',g.description+' '+g.instructions):{};}
export default async function Game({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(isRetiredArcade(slug))notFound();const fresh=freshGame(slug);if(fresh)return <div className="arcade-shell"><FreshGame key={fresh.slug} slug={fresh.slug}/></div>;const c=clubGame(slug),p=puzzleGame(slug);if(c)return <div className="arcade-shell"><ClubGame key={c.slug} slug={c.slug}/></div>;if(p)return <div className="arcade-shell"><PuzzleGame key={p.slug} slug={p.slug}/></div>;const g=arcadeGame(slug);if(!g)notFound();return <div className="arcade-shell"><ArcadeGame slug={g.slug}/></div>;}


