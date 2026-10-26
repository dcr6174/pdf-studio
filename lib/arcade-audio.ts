import {playStadiumSound} from './stadium-audio';
/** Lightweight original synth effects; never downloads or loops audio. */
export type ArcadeEffect='tap'|'success'|'miss'|'bounce'|'hit'|'goal'|'wicket';
let audio:AudioContext|null=null;
const shape:Record<string,Partial<Record<ArcadeEffect,{freq:number;end:number;duration:number;wave:OscillatorType}>>>={
 cricket:{hit:{freq:170,end:92,duration:.13,wave:'triangle'},bounce:{freq:115,end:85,duration:.065,wave:'triangle'},goal:{freq:440,end:880,duration:.28,wave:'sine'},miss:{freq:205,end:125,duration:.15,wave:'triangle'}},
 volleyball:{hit:{freq:245,end:125,duration:.13,wave:'sine'},bounce:{freq:175,end:110,duration:.08,wave:'triangle'},goal:{freq:570,end:840,duration:.25,wave:'sine'}},
 pool:{hit:{freq:520,end:215,duration:.08,wave:'sine'},bounce:{freq:405,end:170,duration:.06,wave:'sine'},goal:{freq:300,end:650,duration:.18,wave:'triangle'}},
 balloons:{tap:{freq:500,end:350,duration:.07,wave:'sine'},success:{freq:660,end:850,duration:.09,wave:'sine'}},
 fruit:{hit:{freq:700,end:320,duration:.12,wave:'triangle'},miss:{freq:190,end:110,duration:.2,wave:'triangle'}},
 catch:{success:{freq:550,end:880,duration:.15,wave:'sine'}},
 sequence:{tap:{freq:410,end:510,duration:.14,wave:'sine'}},
 difference:{success:{freq:420,end:660,duration:.15,wave:'sine'}},
 hidden:{success:{freq:490,end:770,duration:.14,wave:'sine'}},
 anagram:{tap:{freq:440,end:370,duration:.04,wave:'triangle'}},
 hangman:{tap:{freq:375,end:490,duration:.07,wave:'sine'}},
 ladder:{success:{freq:460,end:690,duration:.15,wave:'sine'}},
 sort:{tap:{freq:330,end:260,duration:.09,wave:'sine'}},
 pipes:{tap:{freq:285,end:380,duration:.1,wave:'sine'}},
 parking:{tap:{freq:195,end:135,duration:.11,wave:'triangle'}},
 tictactoe:{tap:{freq:390,end:525,duration:.09,wave:'sine'}},
 spiral:{tap:{freq:270,end:355,duration:.06,wave:'sine'},goal:{freq:365,end:720,duration:.25,wave:'sine'},miss:{freq:190,end:105,duration:.13,wave:'triangle'}},
 hop:{bounce:{freq:235,end:145,duration:.1,wave:'triangle'},goal:{freq:500,end:880,duration:.25,wave:'sine'}},
 highway:{tap:{freq:215,end:180,duration:.06,wave:'triangle'},miss:{freq:175,end:80,duration:.17,wave:'sawtooth'}},
 metro:{tap:{freq:410,end:485,duration:.07,wave:'sine'},hit:{freq:225,end:165,duration:.08,wave:'triangle'}},
 jungle:{tap:{freq:320,end:380,duration:.07,wave:'sine'},hit:{freq:185,end:120,duration:.11,wave:'triangle'}},
 hill:{tap:{freq:140,end:165,duration:.12,wave:'sawtooth'},miss:{freq:205,end:90,duration:.18,wave:'triangle'}},
 drift:{tap:{freq:165,end:235,duration:.13,wave:'sawtooth'},success:{freq:465,end:650,duration:.11,wave:'triangle'}},
 snow:{tap:{freq:510,end:570,duration:.07,wave:'sine'}},
 river:{tap:{freq:280,end:370,duration:.095,wave:'sine'}},
 rocket:{tap:{freq:145,end:360,duration:.17,wave:'sawtooth'},goal:{freq:570,end:1020,duration:.25,wave:'sine'}},
 wrap:{tap:{freq:690,end:260,duration:.05,wave:'sine'},success:{freq:550,end:740,duration:.09,wave:'sine'}},
 clean:{tap:{freq:210,end:130,duration:.06,wave:'triangle'},success:{freq:360,end:520,duration:.11,wave:'sine'}},
 polish:{tap:{freq:475,end:680,duration:.08,wave:'sine'},success:{freq:680,end:900,duration:.14,wave:'sine'}},
 sand:{tap:{freq:160,end:125,duration:.08,wave:'triangle'},goal:{freq:485,end:720,duration:.22,wave:'sine'}},
 rings:{tap:{freq:360,end:295,duration:.08,wave:'triangle'},goal:{freq:550,end:850,duration:.26,wave:'sine'}},
 screws:{tap:{freq:570,end:330,duration:.1,wave:'triangle'}},
 paint:{tap:{freq:590,end:690,duration:.06,wave:'sine'}},
 pegball:{tap:{freq:355,end:280,duration:.06,wave:'triangle'},goal:{freq:440,end:775,duration:.18,wave:'sine'}},
 pingpong:{hit:{freq:305,end:155,duration:.07,wave:'triangle'},goal:{freq:615,end:875,duration:.18,wave:'sine'}},
 bowling:{hit:{freq:200,end:75,duration:.19,wave:'triangle'}},
 darts:{hit:{freq:385,end:255,duration:.07,wave:'triangle'},goal:{freq:645,end:945,duration:.21,wave:'sine'}},
 penalty:{hit:{freq:230,end:165,duration:.12,wave:'triangle'},goal:{freq:550,end:840,duration:.22,wave:'sine'}},
 marble:{tap:{freq:470,end:420,duration:.045,wave:'sine'},goal:{freq:520,end:950,duration:.28,wave:'sine'}}
};
const fallback:Record<ArcadeEffect,{freq:number;end:number;duration:number;wave:OscillatorType}>={
 tap:{freq:340,end:440,duration:.07,wave:'sine'},
 success:{freq:540,end:810,duration:.16,wave:'sine'},
 miss:{freq:220,end:150,duration:.12,wave:'triangle'},
 bounce:{freq:370,end:290,duration:.045,wave:'sine'},
 hit:{freq:410,end:235,duration:.1,wave:'triangle'},
 goal:{freq:580,end:1050,duration:.23,wave:'sine'},
 wicket:{freq:330,end:120,duration:.26,wave:'triangle'}
};
/** Must only be called from an actual player gesture or a sound-enabled gameplay callback. */
export function playArcadeSound(kind:string,effect:ArcadeEffect){
 if(kind==='cricket'){
  const sound=effect==='goal'||effect==='success'?'boundary':effect==='wicket'?'wicket':effect==='miss'?'miss':effect==='tap'?'delivery':effect==='bounce'?'bounce':'hit';
  playStadiumSound('cricket',sound);
  return;
 }
 if(typeof window==='undefined')return;
 try{
  audio??=new AudioContext();
  if(audio.state==='suspended')void audio.resume().catch(()=>{});
  const profile=shape[kind]?.[effect]??fallback[effect];
  const now=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();
  osc.type=profile.wave;
  osc.frequency.setValueAtTime(profile.freq,now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40,profile.end),now+profile.duration);
  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(.028,now+.012);
  gain.gain.exponentialRampToValueAtTime(.0001,now+profile.duration);
  osc.connect(gain);gain.connect(audio.destination);
  osc.start(now);osc.stop(now+profile.duration+.008);
 }catch{/* Audio failure must never stop gameplay. */}
}
