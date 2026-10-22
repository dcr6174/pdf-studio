/** Pure gameplay rules shared by the UI and deterministic regression tests. */
export const RING_PAR_MOVES=15; // 2^4 - 1
export function ringSolveScore(moves:number,ringCount=4){
 const par=2**ringCount-1;
 return Math.max(25,200-Math.max(0,Math.floor(moves)-par)*5);
}
export function mazeCompletionScore(moves:number){
 return Math.max(25,300-Math.max(0,Math.floor(moves)-14)*3);
}
/** Scoring is awarded only on reaching the goal; intermediate moves award zero. */
export const mazeStepScore=()=>0;
export const PENALTY_ROUNDS=5;
export const PENALTY_GOALS_TO_WIN=3;
export function penaltySummary(goals:number,attempts:number){
 const played=Math.max(0,Math.min(PENALTY_ROUNDS,Math.floor(attempts)));
 const scored=Math.max(0,Math.min(played,Math.floor(goals)));
 const won=played===PENALTY_ROUNDS&&scored>=PENALTY_GOALS_TO_WIN;
 return {played,goals:scored,won,complete:played===PENALTY_ROUNDS,
  message:won?`Penalty shootout won: ${scored}/5 goals!`:`Shootout complete: ${scored}/5 goals. Score at least ${PENALTY_GOALS_TO_WIN} to win.`};
}
export const SKILL_ROUND_LIMIT=5;
export function skillRoundLabel(played:number,total=SKILL_ROUND_LIMIT){
 return Math.min(Math.max(0,played)+1,total);
}
export function dartsAfterThrow(attempts:number,hits:readonly number[],aim:number,target:number){
 if(!Number.isInteger(aim)||aim<0||aim>11||attempts>=8)return {attempts,hits:[...hits],hit:false,complete:attempts>=8};
 const hit=Math.abs(aim-target)<=1&&!hits.includes(aim);
 const next=hit?[...hits,aim]:[...hits];
 return {attempts:attempts+1,hits:next,hit,complete:attempts+1>=8};
}
export function tennisScoreAfterRally(player:number,computer:number,winner:'player'|'computer'){
 const p=player+(winner==='player'?1:0),c=computer+(winner==='computer'?1:0);
 return {player:p,computer:c,won:p>=7,lost:c>=7};
}
export function nextLevelIndex(current:number,length:number){
 return length>0?(current+1)%length:0;
}
