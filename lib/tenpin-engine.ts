import {rollBowlingBall} from './sport-contact';
export type BowlingState={
 frame:number;attempt:number;firstPins:number;standing:readonly number[];rolls:readonly number[];
 total:number;ended:boolean;lastPins:number;message:string;isStrike:boolean;isSpare:boolean;
};
const allPins=()=>Array.from({length:10},(_,i)=>i);
export function startBowling():BowlingState{return{frame:0,attempt:0,firstPins:0,standing:allPins(),rolls:[],total:0,ended:false,lastPins:0,message:'Pick your aim, adjust the hook and bowl.',isStrike:false,isSpare:false};}
/** Normal ten-pin bonuses (strike adds next two rolls, spare next one). Incomplete future bonus stays pending. */
export function tenPinScore(rolls:readonly number[]):number{
 let score=0,index=0;
 for(let frame=0;frame<10&&index<rolls.length;frame++){
  const first=rolls[index]??0;
  if(first===10){score+=10+(rolls[index+1]??0)+(rolls[index+2]??0);index++;}
  else{const second=rolls[index+1];score+=first+(second??0);if(second!==undefined&&first+second===10)score+=rolls[index+2]??0;index+=2;}
 }
 return score;
}
export function takeBowlingRoll(current:BowlingState,pins:number):BowlingState{
 if(current.ended)return current;
 const knocked=Math.max(0,Math.min(current.standing.length,Math.floor(pins)));
 const rolls=[...current.rolls,knocked];
 const first=current.attempt===0?knocked:current.firstPins;
 let frame=current.frame,attempt=current.attempt+1,standing=current.standing.slice(knocked),
 ended=false,isStrike=false,isSpare=false;
 if(frame<9){
  if(current.attempt===0&&knocked===10){isStrike=true;frame++;attempt=0;standing=allPins();}
  else if(current.attempt===1){isSpare=first+knocked===10;frame++;attempt=0;standing=allPins();}
 }else{
  if(current.attempt===0){
   if(knocked===10){isStrike=true;standing=allPins();}
  }else if(current.attempt===1){
   if(first===10){if(knocked===10)standing=allPins();}
   else if(first+knocked===10){isSpare=true;standing=allPins();}
   else ended=true;
  }else ended=true;
 }
 // True surviving pin IDs are supplied by the collision solver via withStanding().
 return{...current,frame,attempt,firstPins:attempt===0?0:first,standing,
  rolls,total:tenPinScore(rolls),ended,lastPins:knocked,isStrike,isSpare,
  message:knocked===10?'STRIKE! A full rack down.':isSpare?'SPARE! Cleaned up the rack.':knocked+' pins knocked down.'};
}
export function withStanding(state:BowlingState,remaining:readonly number[]):BowlingState{
 return state.ended||state.attempt===0||state.isSpare||state.isStrike?state:{...state,standing:[...remaining]};
}
export function simulateBowlingRoll(state:BowlingState,aim:number,power:number,hook:number){
 const outcome=rollBowlingBall(aim,power,state.standing,hook);
 const next=withStanding(takeBowlingRoll(state,outcome.contacted.length),outcome.remaining);
 return{next,flight:outcome};
}
export function bowlingFrameDisplay(rolls:readonly number[]):string[][]{
 const display:string[][]=[],values=(x:number)=>x===10?'X':x===0?'-':String(x);
 let i=0;
 for(let frame=0;frame<10;frame++){
  if(i>=rolls.length){display.push([]);continue;}
  const first=rolls[i];
  if(frame<9){
   if(first===10){display.push(['X']);i++;}
   else{const second=rolls[i+1];display.push(second===undefined?[values(first)]:[values(first),first+second===10?'/':values(second)]);i+=2;}
  }else{
   const second=rolls[i+1],third=rolls[i+2];
   display.push([values(first),...(second===undefined?[]:[first!==10&&first+second===10?'/':values(second)]),...(third===undefined?[]:[values(third)])]);i+=3;
  }
 }
 return display;
}
