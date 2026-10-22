import {arcadeGames} from './arcade-catalog';
import {puzzleGames} from './puzzle-catalog';
import {clubGames} from './club-catalog';
import {freshGames} from './fresh-catalog';

/** Retired concepts remain in source for save compatibility; they are no longer discoverable or routed. */
export const retiredArcadeSlugs=[
 'crossword-garden','crossword-sprint','crossword-atlas','word-postcards',
 'letter-dice','clue-hunt','word-path','letter-solitaire',
 'quiet-words','orbit-words','category-cards','pocket-puzzle-mix',
 'buddy-pachisi','word-duel','secret-quote','disc-drop-plinko'
] as const;
const retired=new Set<string>(retiredArcadeSlugs);
export const isRetiredArcade=(slug:string)=>retired.has(slug);
export const activeArcadeGames=[...arcadeGames,...puzzleGames,...clubGames].filter(game=>!retired.has(game.slug)).concat(freshGames as unknown as typeof arcadeGames[number][]);
/** The catalogue is deliberately capped at sixty genuinely different games. */
if(activeArcadeGames.length!==60||new Set(activeArcadeGames.map(g=>g.slug)).size!==60)throw Error('Arcade must have exactly 60 unique playable titles.');
