import '@/components/arcade-garden.css';
import {notFound} from 'next/navigation';
import {ArcadeGame} from '@/components/arcade-game';
import {ClubGame} from '@/components/club-game';
import {clubGames,clubGame} from '@/lib/club-catalog';
import {PuzzleGame} from '@/components/puzzle-game';
import {arcadeGames,arcadeGame} from '@/lib/arcade-catalog';
import {puzzleGames,puzzleGame} from '@/lib/puzzle-catalog';
import {pageMeta} from '@/lib/page-meta';
import '../arcade.css';
import '../puzzles.css';
import '../club.css';
export function generateStaticParams(){return [...arcadeGames,...puzzleGames,...clubGames].map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params,g=arcadeGame(slug)??puzzleGame(slug)??clubGame(slug);return g?pageMeta('/lab/arcade/'+g.slug,g.name+' — play free in Studio Arcade',g.description+' '+g.instructions):{};}
export default async function Game({params}:{params:Promise<{slug:string}>}){const {slug}=await params,c=clubGame(slug),p=puzzleGame(slug);if(c)return <div className="arcade-shell"><ClubGame key={c.slug} slug={c.slug}/></div>;if(p)return <div className="arcade-shell"><PuzzleGame key={p.slug} slug={p.slug}/></div>;const g=arcadeGame(slug);if(!g)notFound();return <div className="arcade-shell"><ArcadeGame slug={g.slug}/></div>;}


