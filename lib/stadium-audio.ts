/** Small original stadium sound designer: bat leather, hoop impacts and crowd.
 * No remote audio files, autoplay loops, copyrighted recordings or network requests.
 */
import {audioContext,busNode} from './arcade-mixer';
export type StadiumSound='start'|'delivery'|'bounce'|'hit'|'boundary'|'wicket'|'miss'|'rim'|'backboard'|'score'|'shoot';
let lastAudio=0;
let cricketBed:AudioBufferSourceNode|null=null;
let cricketBedGain:GainNode|null=null;
function startContext(){return audioContext();}
function tone(a:AudioContext,start:number,frequency:number,stopFrequency:number,duration:number,level:number,wave:OscillatorType='sine'){
 const o=a.createOscillator(),g=a.createGain();
 o.type=wave;o.frequency.setValueAtTime(frequency,start);
 o.frequency.exponentialRampToValueAtTime(Math.max(35,stopFrequency),start+duration);
 g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(level,start+.009);
 g.gain.exponentialRampToValueAtTime(.0001,start+duration);
 o.connect(g);g.connect(busNode(a,'sfx'));o.start(start);o.stop(start+duration+.015);
}
function noise(a:AudioContext,start:number,duration:number,level:number,frequency=1550,quality=.85){
 const frames=Math.ceil(duration*a.sampleRate),b=a.createBuffer(1,frames,a.sampleRate),c=b.getChannelData(0);
 // A short random burst through a bandpass filter sounds like real contact, not a beep.
 for(let i=0;i<frames;i++){const t=i/frames;c[i]=(Math.random()*2-1)*Math.pow(1-t,quality);}
 const source=a.createBufferSource(),filter=a.createBiquadFilter(),g=a.createGain();
 source.buffer=b;filter.type='bandpass';filter.frequency.setValueAtTime(frequency,start);
 filter.Q.value=.65;g.gain.setValueAtTime(.0001,start);
 g.gain.exponentialRampToValueAtTime(level,start+.005);
 g.gain.exponentialRampToValueAtTime(.0001,start+duration);
 source.connect(filter);filter.connect(g);g.connect(busNode(a,'sfx'));
 source.start(start);source.stop(start+duration+.005);
}
/** Gentle filtered crowd murmur, started only after an explicit playing gesture.
 * Reused across deliveries; do not create an audio node on every animation frame. */
export function startCricketAmbience(){
 const a=startContext();if(!a||cricketBed)return;
 try{
  const frames=Math.floor(a.sampleRate*2),buf=a.createBuffer(1,frames,a.sampleRate),data=buf.getChannelData(0);
  let smooth=0;for(let i=0;i<frames;i++){smooth=.88*smooth+.12*(Math.random()*2-1);data[i]=smooth*.9+Math.sin(i/a.sampleRate*2*Math.PI*43)*.035;}
  const src=a.createBufferSource(),filter=a.createBiquadFilter(),gain=a.createGain();
  src.buffer=buf;src.loop=true;filter.type='lowpass';filter.frequency.value=850;
  gain.gain.value=.022;src.connect(filter);filter.connect(gain);gain.connect(busNode(a,'ambience'));
  src.start();cricketBed=src;cricketBedGain=gain;
 }catch{/* Ambient audio is optional and never blocks gameplay. */}
}
export function stopCricketAmbience(){
 try{cricketBed?.stop();cricketBed?.disconnect();cricketBedGain?.disconnect();}catch{}
 cricketBed=null;cricketBedGain=null;
}
function cheer(a:AudioContext,t:number,long=false){
 const d=long?.95:.54;
 noise(a,t,d,.07,520,.45);
 tone(a,t+.06,330,425,d*.8,.022,'triangle');
 tone(a,t+.1,444,550,d*.65,.018,'sawtooth');
}
export function playStadiumSound(kind:'cricket'|'hoops',effect:StadiumSound){
 const a=startContext();if(!a)return;
 const now=a.currentTime;
 const ms=Date.now();
 if(effect==='bounce'&&ms-lastAudio<65)return;
 lastAudio=ms;
 if(kind==='cricket'){
  switch(effect){
   case 'start':tone(a,now,580,820,.21,.04);noise(a,now+.04,.09,.025,2000);break;
   case 'delivery':noise(a,now,.11,.022,760);tone(a,now,170,110,.12,.018,'triangle');break;
   case 'bounce':noise(a,now,.065,.07,1100,1.5);tone(a,now,180,99,.085,.048,'triangle');break;
   case 'hit':
    // Sharply filtered wood-leather crack, with a low bat thump for impact.
    noise(a,now,.1,.26,2350,.85);tone(a,now,345,135,.13,.14,'triangle');
    noise(a,now+.012,.07,.09,4100,1.1);break;
   case 'boundary':
    noise(a,now,.11,.29,2580,.85);tone(a,now,330,120,.17,.13,'triangle');
    cheer(a,now+.10,true);tone(a,now+.26,640,950,.28,.06,'sine');break;
   case 'wicket':
    noise(a,now,.23,.26,3200,.85);tone(a,now,430,110,.28,.12,'sawtooth');
    tone(a,now+.13,150,85,.3,.09,'triangle');cheer(a,now+.23,true);break;
   case 'miss':
    noise(a,now,.1,.085,1250);tone(a,now,195,85,.16,.055,'triangle');break;
   default:break;
  }
 }else{
  switch(effect){
   case 'start':tone(a,now,720,980,.16,.055);tone(a,now+.12,920,670,.19,.043);break;
   case 'shoot':noise(a,now,.095,.065,430,1.1);tone(a,now,165,85,.13,.07,'triangle');break;
   case 'rim':noise(a,now,.14,.13,2300,1.15);tone(a,now,700,310,.2,.09,'square');break;
   case 'backboard':noise(a,now,.09,.1,1200);tone(a,now,240,115,.19,.075,'triangle');break;
   case 'bounce':noise(a,now,.08,.055,650);tone(a,now,160,78,.16,.06,'sine');break;
   case 'score':noise(a,now,.1,.055,2400);tone(a,now,630,810,.17,.045);tone(a,now+.13,780,1090,.25,.046);cheer(a,now+.16,true);break;
   case 'miss':tone(a,now,240,120,.2,.052,'triangle');break;
   default:break;
  }
 }
}
/** Called from a real click/gesture to let Web Audio start on mobile browsers. */
export function unlockStadiumAudio(){
 const a=startContext();if(a&&a.state==='suspended')void a.resume().catch(()=>{});
}
