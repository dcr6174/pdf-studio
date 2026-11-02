'use client';
import {ballAt,cricketFielders,type BowledBall,type ShotSide,type StrokeResult} from '@/lib/cricket-engine';
type Phase='setup'|'bowling'|'result'|'done';
const fieldMap:Record<ShotSide,{x:number;y:number}>={leg:{x:83,y:181},straight:{x:373,y:55},off:{x:663,y:188}};
export function CricketStadiumFallback({ball,elapsed,result,shotDirection,loft,phase,strokeFlash,teamColor='#b6ed40',opponentColor='#ffb56e'}:{
 ball:BowledBall;elapsed:number;result:StrokeResult|null;shotDirection:ShotSide;loft:boolean;phase:Phase;strokeFlash:number;teamColor?:string;opponentColor?:string;
}){
 const current=ballAt(ball,elapsed),target=result?{x:result.impactX,y:result.impactY}:fieldMap[shotDirection];
 const sw=Math.min(1,elapsed/ball.contactMs),landing=ballAt(ball,ball.contactMs*ball.bounce);
 const progressPercent=Math.round(sw*100);
 return <svg className="play-cricket-field" viewBox="0 0 760 555" role="img" aria-label={'Cricket ground from behind the striker; ball approaching '+ball.length+' length on '+(ball.line<-1?'leg':ball.line>1?'off':'middle')+' stump. Delivery progress '+progressPercent+' percent.'}>
 <defs>
 <radialGradient id="pc-outfield" cx="49%" cy="54%" r="70%"><stop offset="0" stopColor="#34825c"/><stop offset=".75" stopColor="#216344"/><stop offset="1" stopColor="#133d31"/></radialGradient>
 <linearGradient id="pc-stand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#112a43"/><stop offset="1" stopColor="#1b4157"/></linearGradient>
 <linearGradient id="pc-pitch" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8ba85"/><stop offset="1" stopColor="#a98757"/></linearGradient>
 <filter id="pc-ball-shadow"><feGaussianBlur stdDeviation="2"/></filter>
 </defs>
 <rect width="760" height="555" rx="20" fill="#071426"/>
 <path d="M0 67Q380 -25 760 67V191H0Z" fill="url(#pc-stand)"/>
 {Array.from({length:43},(_,i)=><g key={i}><rect x={i*19-5} y={82+i%3*11} width="8" height="5" rx="2" fill={['#e6c69c','#b5dfe6','#efb7b8','#d8cbf0'][i%4]}/><rect x={i*18+8} y={121+i%4*8} width="7" height="5" rx="2" fill="#e2d6c5"/></g>)}
 {[70,690].map(x=><g key={x}><path d={'M'+x+' 25V180'} stroke="#5c758a" strokeWidth="5"/><rect x={x-27} y="20" width="54" height="15" rx="3" fill="#edf6ff"/><path d={'M'+(x-20)+' 35L'+(x-110)+' 250H'+(x+140)+'L'+(x+20)+' 35Z'} fill="#e1efff" opacity=".045"/></g>)}
 <rect y="176" width="760" height="15" fill="#e9ece3"/>
 <rect y="191" width="760" height="364" fill="url(#pc-outfield)"/>
 <ellipse cx="380" cy="363" rx="350" ry="162" fill="none" stroke="#d5e5b1" strokeWidth="3.5" strokeDasharray="9 7" opacity=".75"/>
 {[215,292,370,449].map((y,i)=><path key={i} d={'M33 '+y+'Q380 '+(y-42)+' 727 '+y} fill="none" stroke="#ffffff16" strokeWidth="19"/>)}
 <path d="M335 159H425L513 550H248Z" fill="url(#pc-pitch)" stroke="#ffeac3" strokeWidth="3"/>
 <path d="M332 193H428M276 466H480" stroke="#fff5d9" strokeWidth="6"/>
 <path d="M353 171V199M374 171V199M395 171V199M348 456V500M378 456V500M408 456V500" stroke="#e7b985" strokeWidth="1.5" opacity=".7"/>
 <path d="M352 168V135M379 168V135M406 168V135" stroke="#fff4da" strokeWidth="7" strokeLinecap="round"/>
 <path d="M348 135H411" stroke="#fff4da" strokeWidth="5"/>
 {cricketFielders.map((p)=><g key={p.name} transform={'translate('+p.x+' '+p.y+')'}><ellipse cy="11" rx="13" ry="5" fill="#244d4b44"/><circle cy="-9" r="7" fill="#f1c4a8"/><path d="M-9 -2h18l8 20h-34z" fill={opponentColor} stroke="#ffffffaa" strokeWidth="1.5"/><circle cx="0" cy="-19" r="5" fill="#263e61"/></g>)}
 <g transform="translate(378 188) scale(.78)"><ellipse cy="19" rx="13" ry="4" fill="#533d2866"/><circle cy="-17" r="12" fill="#f4c3a5"/><path d="M-14 -6h28l6 37h-38z" fill="#e0e8f2" stroke="#7da5bd" strokeWidth="2"/><path d="M-13 30l-6 24m31-24 8 24" stroke="#e0e8f2" strokeWidth="8" strokeLinecap="round"/></g>
 <g transform="translate(362 474)"><ellipse cx="-10" cy="51" rx="30" ry="8" fill="#45382266"/><path d="M-7 -10l-10 41m17-40 18 42" stroke="#dfe7fa" strokeWidth="14" strokeLinecap="round"/><path d="M-31 -12Q-8 -30 15 -18l16 39-52 6z" fill={teamColor} stroke="#557068" strokeWidth="3"/><circle cx="-6" cy="-34" r="15" fill="#d79f82"/><path d="M-22 -38q7-21 30-15l12 10-26 8z" fill="#315e86"/><path d="M-25 -1l-14 16m36-21 28 7" stroke="#f0bb9e" strokeWidth="12" strokeLinecap="round"/><path className={(phase==='result'||phase==='done')?'pc-bat-swing':''} key={strokeFlash} d="M26 7L69 43" stroke="#f1d6a2" strokeWidth="13" strokeLinecap="round"/></g>
 <g><path d="M340 462V515m18-54v54m18-54v54" stroke="#fff6e7" strokeWidth="7" strokeLinecap="round"/><path d="M337 462H380" stroke="#fff6e7" strokeWidth="5"/></g>
 {phase==='bowling'&&<>
  <circle cx={landing.x} cy={landing.y+9} r="20" fill="#e3eeae24" stroke="#ffefc1" strokeWidth="3" strokeDasharray="8 5"/>
  <ellipse cx={current.x} cy={current.y+14} rx={7+sw*7} ry="5" fill="#13282788" filter="url(#pc-ball-shadow)"/>
  <circle cx={current.x} cy={current.y-current.z} r={5+sw*5.2} fill="#f5f3e8" stroke="#bb3c45" strokeWidth={1.6+sw}/>
  <path d={'M'+(current.x-4)+' '+(current.y-current.z-3)+'l6 6'} stroke="#bc4651" strokeWidth="2"/>
 </>}
 {(phase==='result'||phase==='done')&&result&&<>
  {result.wicket?<g className="pc-wicket-burst"><path d="M344 464l-23-48m44 47 26-53m-27 69 13-58" stroke="#fff6e9" strokeWidth="6" strokeLinecap="round"/><text x="380" y="190" textAnchor="middle" fontSize="22" fontWeight="950" fill="#ffeab7">THE BAILS FLY!</text></g>:result.runs>=4?<g className="pc-boundary-flags">{Array.from({length:18},(_,i)=><g key={i} transform={'translate('+(35+i*39)+' '+(92+i%3*30)+')'}><path d="M0 0v31" stroke="#e9f4dd" strokeWidth="3"/><path d="M2 0l19 7-19 9z" fill={['#ffe599','#87e5b3','#f2a1aa'][i%3]}/></g>)}</g>:null}
  <path key={'flight-'+strokeFlash} className={loft?'pc-flight pc-flight-loft':'pc-flight'} d={'M359 452Q'+(result.direction==='leg'?120:result.direction==='off'?642:380)+' '+(loft?28:208)+' '+target.x+' '+target.y} stroke={result.wicket?'#ffd0c0':'#fceaa7'} strokeWidth="5" fill="none" strokeDasharray={loft?'10 7':'5 7'}/>
  <circle cx={target.x} cy={target.y} r="19" fill="#fff9d5aa" stroke="#ffffff" strokeWidth="4" className="pc-impact"/>
  <text x="380" y="110" textAnchor="middle" className="pc-big-result" key={'result-'+strokeFlash}>{result.wicket?'OUT!':result.runs===6?'SIX!':result.runs===4?'FOUR!':result.runs?result.runs+' RUN'+(result.runs===1?'':'S'):'DOT BALL'}</text>
 </>}
 <text x="22" y="31" fill="#d6e8db" fontSize="15" fontWeight="800">BATTING CAMERA · ORIGINAL ARCADE</text>
 </svg>;
}
