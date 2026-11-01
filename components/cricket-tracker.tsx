import {ballAt,cricketFielders,type BowledBall,type StrokeResult,type Innings} from '@/lib/cricket-engine';
/** Shot rays use the same landing coordinates as the scoring engine and stadium. */
export function CricketTracker({innings,onOpenChange}:{innings:Innings;onOpenChange?:(open:boolean)=>void}){
 const shots=innings.events.filter(e=>e.batRuns>0).slice(-36);
 return <details className="pc-tracker" onToggle={e=>onOpenChange?.(e.currentTarget.open)}><summary>Field & scorecard · {innings.extras} extras</summary><div className="pc-tracker-grid">
  <svg viewBox="0 0 240 180" role="img" aria-label={'Shot map: '+shots.length+' scoring shots, mapped to actual landing positions'}><ellipse cx="120" cy="90" rx="108" ry="72" fill="#173f36" stroke="#9bbfa8"/><rect x="116" y="81" width="8" height="35" fill="#d3b786"/>{cricketFielders.map(f=><circle key={f.name} cx={120+(f.x-380)*.27} cy={90+(f.y-363)*.36} r="3" fill="#d4e5df"><title>{f.name}</title></circle>)}{shots.map((e,i)=><line key={i} x1="120" y1="90" x2={120+(e.impactX-380)*.27} y2={90+(e.impactY-363)*.36} stroke={e.batRuns>=4?'#f8cf75':'#91d9c4'} strokeWidth={e.batRuns===6?2.5:1.3} opacity=".8"/>)}</svg>
  <table><caption>Batting card · fictional eleven</caption><thead><tr><th>Batter</th><th>R</th><th>B</th><th>4/6</th></tr></thead><tbody>{innings.batters.map((b,i)=>(i<innings.nextBatter||b.balls>0)&&<tr key={i}><th scope="row">{String(i+1).padStart(2,'0')}{b.out?' out':i===innings.striker?' *':''}</th><td>{b.runs}</td><td>{b.balls}</td><td>{b.fours}/{b.sixes}</td></tr>)}</tbody></table>
 </div><p>{innings.wides} wides · {innings.noBalls} no-balls{innings.freeHit?' · FREE HIT NEXT':''}</p></details>;
}

/** Live radar uses the delivery and scoring coordinates, rather than an ornamental animation. */
export function CricketRadar({ball,elapsed,result}:{ball:BowledBall;elapsed:number;result:StrokeResult|null}){
 const point=ballAt(ball,elapsed),x=(v:number)=>12+v/760*96,y=(v:number)=>10+v/550*80;
 const bounce=ballAt(ball,ball.contactMs*ball.bounce);
 return <svg className="pc-live-radar" viewBox="0 0 120 100" role="img" aria-label={result?'Shot landing tracker':'Live delivery and bounce tracker'}><ellipse cx="60" cy="50" rx="55" ry="44" fill="#092b27" stroke="#c4d9ad99"/><path d="M57 25h6v50h-6z" fill="#ceb785"/>{cricketFielders.map(f=><circle key={f.name} cx={x(f.x)} cy={y(f.y)} r="1.8" fill="#e5d6a2"/>)}<circle cx={x(bounce.x)} cy={y(bounce.y)} r="3" fill="none" stroke="#f1cd7c"/>{result?<path d={'M'+x(380)+' '+y(465)+'L'+x(result.impactX)+' '+y(result.impactY)} stroke="#ffd47e" strokeWidth="1.8"/>:<circle cx={x(point.x)} cy={y(point.y)} r="2.8" fill="#fff"/>}<text x="60" y="98" textAnchor="middle" fill="#e9eddb" fontSize="6">{result?'SHOT TRACK':'BALL TRACK'}</text></svg>;
}
