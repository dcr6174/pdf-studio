/**
 * Explicit round protocol between every game family and the shared frame (components/game-frame-core.ts).
 * Games report their own phase, score and result; the frame never guesses from button text or CSS classes.
 */
export type ArcadePhase='ready'|'playing'|'paused'|'over';
/** points: higher is better · strokes: fewer is better · outcome: judged by win/draw/loss, not by points. */
export type ScoreKind='points'|'strokes'|'outcome';
/** action games get combo, shake and vibration feedback; calm games (boards, puzzles, words, relax) stay quiet. */
export type FeelKind='action'|'calm';
export type ArcadeProfile={scoreKind:ScoreKind;feel:FeelKind;letterKeys:boolean};
export type ArcadeReport=ArcadeProfile&{
 slug:string;
 phase:ArcadePhase;
 score:number;
 /** The game's own stored best, so the frame shows exactly what the game saves. */
 best:number;
 /** true = player won, false = player lost, null = no winner (finished, draw or two local players). */
 won:boolean|null;
 message:string;
 canPause:boolean;
 /** Current sound state, or null when the game has no sound of its own. */
 sound:boolean|null;
 /** Label for the main end-of-round button when it is not a plain replay, e.g. "Next puzzle". */
 againLabel?:string;
 /** One short live readout the bar shows beside the score, e.g. "42s left" or "Moves 17". */
 detail?:string;
};
export type ArcadeCommand='pause'|'resume'|'restart'|'sound';
export const REPORT_EVENT='studio-arcade:report';
export const COMMAND_EVENT='studio-arcade:command';

const strokes=new Set(['golf']);
const outcome=new Set(['chess','checkers','connect','reversi','dots','fleet','mancala','ludo','snakes','domino','tictactoe']);
/** Families that type letters from the keyboard, so the frame's P/F shortcuts must stay out of the way. */
const letters=new Set(['crossword','cipher']);
const action=new Set([
 'stack','toss','bubbles','snake','breaker','runner','odd',
 'balloons','fruit','catch','cricket','volleyball','pool','spiral','hop',
 'highway','metro','jungle','hill','drift','snow','river','rocket','traffic','prix',
 'archery','bowling','curling','darts','penalty','pingpong','clock','meteor','pegball',
 'basketball','hockey',
]);
/** Per-mechanic profile; anything unlisted is a calm points game. */
export function arcadeProfile(kind:string):ArcadeProfile{
 return {scoreKind:strokes.has(kind)?'strokes':outcome.has(kind)?'outcome':'points',feel:action.has(kind)?'action':'calm',letterKeys:letters.has(kind)};
}

const phases=new Set<ArcadePhase>(['ready','playing','paused','over']);
const kinds=new Set<ScoreKind>(['points','strokes','outcome']);
const finite=(v:unknown)=>typeof v==='number'&&Number.isFinite(v);
export function isArcadeReport(v:unknown):v is ArcadeReport{
 if(!v||typeof v!=='object')return false;const r=v as Record<string,unknown>;
 return typeof r.slug==='string'&&phases.has(r.phase as ArcadePhase)&&finite(r.score)&&finite(r.best)&&(r.won===null||typeof r.won==='boolean')&&typeof r.message==='string'&&kinds.has(r.scoreKind as ScoreKind)&&(r.feel==='action'||r.feel==='calm')&&typeof r.letterKeys==='boolean'&&typeof r.canPause==='boolean'&&(r.sound===null||typeof r.sound==='boolean')&&(r.againLabel===undefined||typeof r.againLabel==='string')&&(r.detail===undefined||typeof r.detail==='string');
}
/** Is `score` an improvement on `best` for this kind of game? A zero best means no record yet. */
export function beats(kind:ScoreKind,score:number,best:number){
 if(kind==='outcome')return false;
 if(kind==='strokes')return score>0&&(best<=0||score<best);
 return score>0&&score>best;
}

/* The frame mounts after its children's first effects, so it reads the latest report on mount. */
const latest=new Map<string,ArcadeReport>();
export const latestArcadeReport=(slug:string)=>latest.get(slug)??null;
export const forgetArcadeReport=(slug:string)=>{latest.delete(slug);};
export function publishArcadeReport(report:ArcadeReport){
 latest.set(report.slug,report);
 window.dispatchEvent(new CustomEvent(REPORT_EVENT,{detail:report}));
}
export function sendArcadeCommand(slug:string,command:ArcadeCommand){
 window.dispatchEvent(new CustomEvent(COMMAND_EVENT,{detail:{slug,command}}));
}
