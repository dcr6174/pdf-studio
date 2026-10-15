import type {GameState} from './arcade-engine';
export function canvasResolution(dpr:number){const scale=Math.min(2,Math.max(1,Number.isFinite(dpr)?dpr:1));return {scale,width:Math.round(400*scale),height:Math.round(500*scale)};}
/** Publish UI on meaningful changes; canvas aiming doesn't need a React render. */
export function arcadeFrameChanged(s:GameState){return [s.score,s.moves,Math.floor(s.time),s.over,s.won,s.message,s.level,s.matched.length,s.selected.join(',')].join('|');}

export function canvasPoint(x:number,y:number,rect:{left:number;top:number;width:number;height:number}){return rect.width>0&&rect.height>0?{x:(x-rect.left)*400/rect.width,y:(y-rect.top)*500/rect.height}:{x:200,y:250};}
