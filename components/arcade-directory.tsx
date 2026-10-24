'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from '@/components/browser-link';
import {GameScenePreview} from '@/components/game-scene-preview';
import {ArcadeGarden} from '@/components/arcade-garden';
import {activeArcadeGames} from '@/lib/arcade-active';
import {ArrowRight,Clock3,Gamepad2,Heart,Search,Sparkles,Trophy} from 'lucide-react';
const favourites=['merge-2048','buddy-jigsaw','lavender-chess','crown-checkers','moon-disc-reversi','pocket-mini-golf','eight-ball-pool','boundary-cricket','bubble-wrap-bliss','crystal-clean'] as const;
const categories=['All games','Easy & relaxing','Action & adventure','Sports','Driving & racing','Brain & puzzles','Word games','Family & board'] as const;
type Category=typeof categories[number];
const simple=['memory-match','picture-patchwork','buddy-jigsaw','color-sort','water-flow','spot-the-difference','find-hidden-object','word-safari','sudoku-studio','peg-garden'];
const action=['buddy-stack','paper-toss','bubble-pop','snake-sprint','neon-breaker','buddy-runner','fruit-slice','spiral-drop','hoop-hop','highway-dash','metro-sprint','jungle-escape','rocket-glide'];
function belongs(game:typeof activeArcadeGames[number],category:Category){if(category==='All games')return true;if(category==='Easy & relaxing')return game.genre==='Relax'||simple.includes(game.slug);if(category==='Action & adventure')return ['Arcade','Quick','Timing','Aim'].includes(game.genre)||action.includes(game.slug);if(category==='Sports')return game.genre==='Sports';if(category==='Driving & racing')return game.genre==='Driving';if(category==='Brain & puzzles')return ['Think','Puzzle'].includes(game.genre);if(category==='Word games')return game.genre==='Word';return game.genre==='Board';}
const highlights=[{label:'A quick break',description:'Ready in seconds',icon:'✦',filter:'Action & adventure'},{label:'Take it easy',description:'No rushing required',icon:'◡',filter:'Easy & relaxing'},{label:'Give your brain a win',description:'Patterns, memory and more',icon:'◇',filter:'Brain & puzzles'},{label:'Race or score',description:'Sports and racing',icon:'↗',filter:'Sports'}] as const;
export function ArcadeDirectory(){
 const [recent,setRecent]=useState<string[]>([]);
 const [category,setCategory]=useState<Category>('All games'),[query,setQuery]=useState(''),[visible,setVisible]=useState(24);
 useEffect(()=>{const timer=setTimeout(()=>{try{const old=JSON.parse(localStorage.getItem('studio-arcade:recent')||'[]');if(Array.isArray(old))setRecent(old.filter((v:unknown)=>typeof v==='string').slice(0,5));}catch{/* Optional recent history. */}},0);return()=>clearTimeout(timer);},[]);
 const games=useMemo(()=>activeArcadeGames.filter(g=>belongs(g,category)&&(g.name+' '+g.genre+' '+g.description).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),[category,query]);
 const shown=games.slice(0,visible);
 const favs=favourites.map(slug=>activeArcadeGames.find(game=>game.slug===slug)).filter((g):g is typeof activeArcadeGames[number]=>!!g);
 const recentGames=recent.map(slug=>activeArcadeGames.find(game=>game.slug===slug)).filter((g):g is typeof activeArcadeGames[number]=>!!g);
 const choose=(next:Category)=>{setCategory(next);setVisible(24);};
 return <div className="play-directory">
 <header className="play-hero"><div className="play-hero-text">
 <span className="play-overline"><Sparkles size={16} aria-hidden="true"/> PLAY STUDIO <span className="play-overline-dot"/> BY PDF STUDIO</span>
 <h1>Big fun.<br/>Little games.</h1>
 <p>100 easy-to-start mini games. Chase a boundary, race through a city, solve a puzzle, or just pop some bubbles. Your next break starts with one tap.</p>
 <div className="play-hero-actions"><Link href="/lab/arcade/boundary-cricket" className="play-primary-cta"><Gamepad2 size={19}/> Play cricket <ArrowRight size={18}/></Link><a href="#play-browse" className="play-secondary-cta">Explore all games ↓</a></div>
 <div className="play-hero-benefits"><span><Clock3 size={16}/> Quick to learn</span><span><Heart size={16}/> All ages welcome</span><span><Trophy size={16}/> Local high scores</span></div>
 </div>
 <div className="play-hero-art" aria-hidden="true"><div className="play-art-orbit one"/><div className="play-art-orbit two"/><div className="play-art-grid"><div className="play-art-tile cricket"><GameScenePreview slug="boundary-cricket"/></div><div className="play-art-tile road"><GameScenePreview slug="metro-sprint"/></div><div className="play-art-tile pool"><GameScenePreview slug="eight-ball-pool"/></div><div className="play-art-tile puzzle"><GameScenePreview slug="buddy-jigsaw"/></div></div><span className="play-art-star star1">✦</span><span className="play-art-star star2">✧</span></div></header>
 <section className="play-mood" aria-labelledby="play-mood-title"><div className="play-section-heading"><div><span className="play-overline">FIND YOUR KIND OF FUN</span><h2 id="play-mood-title">How do you feel like playing?</h2></div><span>Start simple. Play your way.</span></div><div className="play-mood-grid">{highlights.map((item,i)=><button type="button" className={'play-mood-card mood-'+i} key={item.label} onClick={()=>{choose(item.filter as Category);document.getElementById('play-browse')?.scrollIntoView({block:'start'});}}><span className="play-mood-symbol" aria-hidden="true">{item.icon}</span><strong>{item.label}</strong><small>{item.description}</small><span className="play-mood-arrow">↗</span></button>)}</div></section>
 {(recentGames.length>0||!query)&&<section className="play-featured" aria-labelledby="play-featured-title"><div className="play-section-heading"><div><span className="play-overline">HANDPICKED TO START</span><h2 id="play-featured-title">Games worth your next break.</h2></div></div>{recentGames.length>0&&<div className="play-recents"><span>Recently played</span><div>{recentGames.map(g=><Link href={'/lab/arcade/'+g.slug} key={g.slug}>{g.name} →</Link>)}</div></div>}<div className="play-featured-grid">{favs.map((g,i)=><Link href={'/lab/arcade/'+g.slug} className={'play-featured-card tone-'+i%4} key={g.slug}><span className="play-featured-art"><GameScenePreview slug={g.slug}/></span><span className="play-featured-description"><small>{g.genre}</small><strong>{g.name}</strong><span>Play now ↗</span></span></Link>)}</div></section>}
 <section id="play-browse" className="play-browse" aria-labelledby="play-browse-title"><div className="play-browse-head"><div><span className="play-overline">YOUR GAME SHELF</span><h2 id="play-browse-title">Find your next favourite.</h2><p>Browse by mood, or search by name. Every game opens its own playable board. Use How to play for controls.</p></div><label className="play-search"><Search size={19} aria-hidden="true"/><span className="arcade-sr">Search mini games</span><input type="search" placeholder="Search 100 games…" value={query} onChange={e=>{setQuery(e.target.value);setVisible(24);}}/></label></div>
 <div className="play-filters" role="group" aria-label="Game collections">{categories.map(c=><button type="button" key={c} aria-pressed={category===c} onClick={()=>choose(c)}>{c}</button>)}</div>
 <div className="play-results-label" role="status">{games.length} {games.length===1?'game':'games'} to try</div>
 <div className="arcade-grid play-all-games">{shown.map(g=><Link key={g.slug} href={'/lab/arcade/'+g.slug} className="arcade-card" style={{'--game-color':('color' in g ? g.color : '#c2a6f2')} as React.CSSProperties}><div className="arcade-card-art" aria-hidden="true"><GameScenePreview slug={g.slug}/></div><div className="arcade-card-copy"><span className="arcade-card-meta">{g.genre}</span><h3>{g.name}</h3><p>{g.description}</p><span className="arcade-play-link">Play now <b aria-hidden="true">↗</b></span></div></Link>)}</div>
 {games.length>visible&&<div className="play-load-more"><button type="button" onClick={()=>setVisible(v=>v+24)}>Show more games <ArrowRight size={17}/></button><p>{shown.length} of {games.length} shown</p></div>}
 {!games.length&&<div className="arcade-empty"><h3>No games found for that search.</h3><p>Try a different word or browse all 100 games.</p><button onClick={()=>{choose('All games');setQuery('');}}>Show all games</button></div>}
 </section>
 <div className="play-garden-area"><details><summary>My little play garden — optional daily rewards</summary><ArcadeGarden/><p>Collect decorations if you like. You never need rewards to access a game.</p></details></div>
 <p className="arcade-endnote">Free mini games with no in-game ads. Sounds are optional. Progress and best scores are saved in this browser where supported. Try Comfort Mode on our new touch-first games.</p>
 </div>;
}
