import {ballAt,CRICKET_PERFECT_MS,type BowledBall,type Innings,type StrokeResult} from './cricket-engine';

/** Timing direction comes from the signed contact error, never the scoring grade. */
export function cricketTimingFeedback(result:StrokeResult){
 if(result.grade==='miss'&&result.contact===0)return {label:'Missed',detail:result.comment};
 const error=result.timingError,delta=Math.abs(error);
 const label=delta<CRICKET_PERFECT_MS?'Perfect':delta<220?'Good':error<0?'Early':'Late';
 return {label,detail:label==='Early'?'Wait a little longer.':label==='Late'?'Swing a little sooner.':result.comment};
}

/** Keep the completed over on screen until the next delivery is committed. */
export function cricketOverHistory(innings:Innings,nextDelivery=false){
 const start=innings.balls>0&&innings.balls%6===0&&!nextDelivery?innings.balls-6:Math.floor(innings.balls/6)*6;
 return Array.from({length:6},(_,i)=>innings.history[start+i]??'—');
}

export type CricketPoint={x:number;y:number;z:number};
export function cricketBallWorld(ball:BowledBall,elapsed:number):CricketPoint{
 const at=ballAt(ball,elapsed);
 return{x:(at.x-360)/37*.42,y:.16+at.z/28*1.65,z:10.5-21*at.p};
}
export function cricketFieldWorld(x:number,y:number):CricketPoint{
 return{x:(x-380)/350*32,y:0,z:5+(363-y)/162*30};
}
export function cricketShotWorld(ball:BowledBall,result:StrokeResult,progress:number):CricketPoint{
 const p=Math.max(0,Math.min(1,progress)),start=cricketBallWorld(ball,ball.contactMs);
 if(result.wicket&&result.out!=='caught')return{x:start.x*(1-p),y:.16,z:start.z-1.6*p};
 if(result.runs===0&&result.contact===0)return start;
 const end=cricketFieldWorld(result.impactX,result.impactY);
 const height=result.flight>.5?12:1.1;
 return{x:start.x+(end.x-start.x)*p,y:.16+Math.sin(p*Math.PI)*height,z:start.z+(end.z-start.z)*p};
}
