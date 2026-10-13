import {notFound} from 'next/navigation';
import {ArcadeGame} from '@/components/arcade-game';
import {arcadeGames,arcadeGame} from '@/lib/arcade-catalog';
import {pageMeta} from '@/lib/page-meta';
import '../arcade.css';
export function generateStaticParams(){return arcadeGames.map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params,g=arcadeGame(slug);return g?pageMeta('/lab/arcade/'+g.slug,g.name+' — play free in Studio Arcade',g.description+' '+g.instructions):{};}
export default async function Game({params}:{params:Promise<{slug:string}>}){const {slug}=await params,g=arcadeGame(slug);if(!g)notFound();return <div className="arcade-shell"><ArcadeGame slug={g.slug}/></div>;}
