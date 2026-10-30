/**
 * Original synthesized sounds for board, card and puzzle games: wood, felt and paper contacts plus short result phrases.
 * Routed through the shared arcade mixer so the menu's volume sliders apply. Nothing is downloaded.
 */
import {blip,tick} from './arcade-mixer';
export type BoardCue='select'|'place'|'capture'|'invalid'|'win'|'lose'|'draw'|'roll'|'flip'|'hint'|'undo'|'start';
export const BOARD_SOUND_KEY='studio-arcade:sound:board';
const phrase=(notes:number[],step:number,wave:OscillatorType,level:number)=>notes.forEach((f,i)=>blip('sfx',{freq:f,end:f*1.01,duration:.16,wave,level,delay:i*step,spread:0}));
/** Must only be called while the player has sound switched on. */
export function playBoardSound(cue:BoardCue){
 switch(cue){
  case 'select':tick('ui',{duration:.022,freq:2600,q:3,level:.05});break;
  case 'place':tick('sfx',{duration:.055,freq:950,q:2.2,level:.16});blip('sfx',{freq:210,end:170,duration:.07,wave:'triangle',level:.018});break;
  case 'capture':tick('sfx',{duration:.07,freq:650,q:1.6,level:.18});tick('sfx',{duration:.05,freq:1300,q:2,level:.08,delay:.045});blip('sfx',{freq:320,end:160,duration:.13,wave:'triangle',level:.02});break;
  case 'invalid':blip('ui',{freq:185,end:160,duration:.09,wave:'square',level:.01,spread:0});break;
  case 'flip':tick('sfx',{duration:.03,freq:3200,q:1.4,level:.07});blip('sfx',{freq:680,end:880,duration:.06,level:.014});break;
  case 'roll':for(const [i,d] of [0,.05,.11,.19,.3].entries())tick('sfx',{duration:.035,freq:1500+i*120,q:2.5,level:.12-i*.015,delay:d});break;
  case 'hint':blip('ui',{freq:880,end:1320,duration:.18,level:.016});break;
  case 'undo':blip('ui',{freq:520,end:360,duration:.1,wave:'triangle',level:.016});break;
  case 'start':phrase([392,523],.08,'sine',.02);break;
  case 'win':phrase([523,659,784,1047],.09,'sine',.026);break;
  case 'lose':phrase([392,330,262],.13,'triangle',.022);break;
  case 'draw':phrase([440,440],.14,'sine',.018);break;
 }
}
/** Counts occupied cells so a move that removes pieces can sound like a capture. */
export function occupied(board:unknown):number{
 if(!Array.isArray(board))return 0;let n=0;for(const v of board)if(typeof v==='number'?v!==0:v!=null&&v!==''&&v!==false)n++;return n;
}
