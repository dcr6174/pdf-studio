import {arcadeGames} from './arcade-catalog';
import {puzzleGames} from './puzzle-catalog';
import {clubGames} from './club-catalog';
import {freshGames} from './fresh-catalog';
import {expansionGames} from './expansion-catalog';

/** Retired overlapping games are no longer discoverable; their existing save keys are preserved. */
export const retiredArcadeSlugs=[
 'crossword-garden','crossword-sprint','crossword-atlas','word-postcards',
 'letter-dice','clue-hunt','word-path','letter-solitaire',
 'quiet-words','orbit-words','category-cards','pocket-puzzle-mix',
 'buddy-pachisi','word-duel','secret-quote','disc-drop-plinko',
 'buddy-burrows','bullseye-301'
] as const;
const retired=new Set<string>(retiredArcadeSlugs);
export const isRetiredArcade=(slug:string)=>retired.has(slug);
export const activeArcadeGames=[
 ...arcadeGames.filter(g=>!retired.has(g.slug)),
 ...puzzleGames.filter(g=>!retired.has(g.slug)),
 ...clubGames.filter(g=>!retired.has(g.slug)),
 ...freshGames,
 ...expansionGames
];
/** The catalogue must always contain exactly 100 unique, playable mini games. */
if(activeArcadeGames.length!==100||new Set(activeArcadeGames.map(g=>g.slug)).size!==100)throw Error('Play Studio must have exactly 100 unique playable titles.');
