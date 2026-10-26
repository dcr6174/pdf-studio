/** Browser-native, original sports sound design; no remote audio files or third-party assets. */
export type SportsCue='hoops-release'|'hoops-rim'|'hoops-board'|'hoops-floor'|'hoops-swish'|'hoops-cheer'|'hoops-miss'
 |'cricket-bowler'|'cricket-pitch'|'cricket-bat'|'cricket-edge'|'cricket-stumps'|'cricket-four'|'cricket-six'|'cricket-crowd';
let context:AudioContext|null=null;
function audio():AudioContext|null{
 if(typeof window==='undefined'||!('AudioContext'in window))return null;
 try{context??=new AudioContext();return context;}catch{return null;}
}
/** Call this from user gestures before starting a match, to unlock mobile Web Audio. */
export function unlockSportsAudio(){
 const a=audio();if(a&&a.state==='suspended')void a.resume().catch(()=>{});
}
const clamp=(v:number)=>Math.max(.0001,Math.min(.2,v));
function tone(a:AudioContext,at:number,from:number,to:number,duration:number,volume:number,kind:OscillatorType='sine'){
 const osc=a.createOscillator(),amp=a.createGain();osc.type=kind;
 osc.frequency.setValueAtTime(Math.max(30,from),at);
 osc.frequency.exponentialRampToValueAtTime(Math.max(30,to),at+duration);
 amp.gain.setValueAtTime(.0001,at);
 amp.gain.exponentialRampToValueAtTime(clamp(volume),at+.007);
 amp.gain.exponentialRampToValueAtTime(.0001,at+duration);
 osc.connect(amp);amp.connect(a.destination);
 osc.start(at);osc.stop(at+duration+.015);
}
function noise(a:AudioContext,at:number,duration:number,volume:number,freq:number,band: 'lowpass'|'highpass'|'bandpass'='bandpass'){
 const buffer=a.createBuffer(1,Math.ceil(a.sampleRate*duration),a.sampleRate),data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(.9+.1*Math.sin(i*.1));
 const source=a.createBufferSource(),filter=a.createBiquadFilter(),gain=a.createGain();
 source.buffer=buffer;filter.type=band;filter.frequency.value=freq;filter.Q.value=.5;
 gain.gain.setValueAtTime(.0001,at);
 gain.gain.linearRampToValueAtTime(clamp(volume),at+.012);
 gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
 source.connect(filter);filter.connect(gain);gain.connect(a.destination);
 source.start(at);source.stop(at+duration);
}
export function playSportsAudio(cue:SportsCue){
 const a=audio();if(!a)return;
 try{
  if(a.state==='suspended')void a.resume().catch(()=>{});
  const t=a.currentTime+.006;
  switch(cue){
   case 'hoops-release':tone(a,t,180,75,.14,.07,'triangle');noise(a,t,.055,.034,560,'lowpass');break;
   case 'hoops-rim':tone(a,t,690,320,.24,.075,'sine');tone(a,t+.012,1050,760,.2,.035,'triangle');break;
   case 'hoops-board':tone(a,t,235,115,.16,.07,'triangle');noise(a,t,.08,.04,700,'lowpass');break;
   case 'hoops-floor':tone(a,t,115,68,.18,.06,'sine');noise(a,t,.09,.048,380,'lowpass');break;
   case 'hoops-swish':noise(a,t,.36,.072,1800,'highpass');tone(a,t+.09,620,900,.22,.042,'sine');break;
   case 'hoops-cheer':
    noise(a,t,.75,.12,740,'bandpass');
    for(let i=0;i<4;i++)tone(a,t+i*.115,320+i*85,440+i*105,.27,.024,'sine');
    break;
   case 'hoops-miss':tone(a,t,260,145,.22,.048,'triangle');break;
   case 'cricket-bowler':noise(a,t,.18,.033,420,'lowpass');tone(a,t,95,135,.14,.026,'triangle');break;
   case 'cricket-pitch':noise(a,t,.09,.08,270,'lowpass');tone(a,t,170,95,.13,.035,'sine');break;
   case 'cricket-bat':
    noise(a,t,.09,.093,1850,'highpass');
    tone(a,t,350,165,.2,.085,'triangle');tone(a,t+.025,660,245,.11,.036,'sine');break;
   case 'cricket-edge':noise(a,t,.08,.085,2700,'highpass');tone(a,t,510,290,.11,.039,'triangle');break;
   case 'cricket-stumps':
    noise(a,t,.28,.1,650,'lowpass');
    for(let i=0;i<3;i++)tone(a,t+i*.05,390+i*125,95+i*15,.21,.064,'triangle');
    break;
   case 'cricket-four':
    noise(a,t,.85,.084,1000,'bandpass');
    for(let i=0;i<3;i++)tone(a,t+.1+i*.14,340+i*90,550+i*125,.25,.035,'sine');
    break;
   case 'cricket-six':
    noise(a,t,1.2,.14,1050,'bandpass');
    for(let i=0;i<5;i++)tone(a,t+.09+i*.13,300+i*75,620+i*95,.28,.038,'sine');
    break;
   case 'cricket-crowd':
    noise(a,t,1.15,.024,410,'bandpass');
    break;
  }
 }catch{/* Audio is optional, gameplay must remain available without a sound device. */}
}
