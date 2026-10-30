/**
 * One shared Web Audio graph for every arcade game: master → effects / interface / ambience buses.
 * Players set each bus once in the arcade menu; every game's synth routes through it. No audio files are downloaded.
 */
export type MixBus='sfx'|'ui'|'ambience';
export type Mix={master:number;sfx:number;ui:number;ambience:number};
export const MIX_KEY='studio-arcade:mix:v1';
export const defaultMix:Mix={master:.8,sfx:1,ui:.7,ambience:.6};
const clamp01=(v:unknown,f:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(1,v)):f;
export function parseMix(raw:string|null):Mix{
 try{const v:unknown=JSON.parse(raw??'{}');if(!v||typeof v!=='object'||Array.isArray(v))return {...defaultMix};const o=v as Record<string,unknown>;
  return {master:clamp01(o.master,defaultMix.master),sfx:clamp01(o.sfx,defaultMix.sfx),ui:clamp01(o.ui,defaultMix.ui),ambience:clamp01(o.ambience,defaultMix.ambience)};
 }catch{return {...defaultMix};}
}
/** Perceptual volume curve: slider 0.5 sounds about half as loud, not barely quieter. */
export const gainFor=(slider:number)=>slider<=0?0:Math.pow(slider,2);
/** Small, repeatable pitch spread so the 50th identical tap does not sound like the first. */
export function pitchSpread(count:number,spread=.035){const x=Math.sin(count*12.9898)*43758.5453;return 1+((x-Math.floor(x))*2-1)*spread;}

let ctx:AudioContext|null=null;
let master:GainNode|null=null;
const buses:Partial<Record<MixBus,GainNode>>={};
let mix:Mix|null=null;
function currentMix(){if(!mix){try{mix=parseMix(localStorage.getItem(MIX_KEY));}catch{mix={...defaultMix};}}return mix;}
/** Returns the running context, creating it lazily. Only call from a gesture or a sound-enabled game callback. */
export function audioContext():AudioContext|null{
 if(typeof window==='undefined')return null;
 try{
  if(!ctx){ctx=new AudioContext();master=ctx.createGain();master.connect(ctx.destination);const m=currentMix();master.gain.value=gainFor(m.master);
   for(const b of ['sfx','ui','ambience'] as const){const g=ctx.createGain();g.gain.value=gainFor(m[b]);g.connect(master);buses[b]=g;}}
  if(ctx.state==='suspended')void ctx.resume().catch(()=>{});
  return ctx;
 }catch{return null;}
}
/** Destination node for a bus; falls back to the speakers if the graph could not be built. */
export function busNode(a:AudioContext,bus:MixBus):AudioNode{return buses[bus]??a.destination;}
export function getMix():Mix{return {...currentMix()};}
export function setMix(next:Partial<Mix>){
 const m={...currentMix(),...next};mix=parseMix(JSON.stringify(m));
 try{localStorage.setItem(MIX_KEY,JSON.stringify(mix));}catch{/* Volume still applies for this visit. */}
 if(ctx&&master){const t=ctx.currentTime;master.gain.setTargetAtTime(gainFor(mix.master),t,.02);for(const b of ['sfx','ui','ambience'] as const)buses[b]?.gain.setTargetAtTime(gainFor(mix[b]),t,.02);}
}
let counter=0;
/** A short shaped tone on a bus, with optional pitch spread. */
export function blip(bus:MixBus,o:{freq:number;end:number;duration:number;wave?:OscillatorType;level?:number;delay?:number;spread?:number}){
 const a=audioContext();if(!a)return;
 try{
  const p=pitchSpread(++counter,o.spread??.035),start=a.currentTime+(o.delay??0),osc=a.createOscillator(),g=a.createGain();
  osc.type=o.wave??'sine';osc.frequency.setValueAtTime(o.freq*p,start);osc.frequency.exponentialRampToValueAtTime(Math.max(40,o.end*p),start+o.duration);
  g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(o.level??.03,start+.01);g.gain.exponentialRampToValueAtTime(.0001,start+o.duration);
  osc.connect(g);g.connect(busNode(a,bus));osc.start(start);osc.stop(start+o.duration+.02);
 }catch{/* Audio failure must never stop gameplay. */}
}
/** A filtered noise burst: wood, felt and paper contact sounds rather than beeps. */
export function tick(bus:MixBus,o:{duration:number;freq:number;q?:number;level?:number;delay?:number}){
 const a=audioContext();if(!a)return;
 try{
  const frames=Math.max(1,Math.ceil(o.duration*a.sampleRate)),buf=a.createBuffer(1,frames,a.sampleRate),data=buf.getChannelData(0);
  for(let i=0;i<frames;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/frames,3);
  const src=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),start=a.currentTime+(o.delay??0);
  src.buffer=buf;f.type='bandpass';f.frequency.value=o.freq*pitchSpread(++counter,.08);f.Q.value=o.q??1.2;g.gain.value=o.level??.12;
  src.connect(f);f.connect(g);g.connect(busNode(a,bus));src.start(start);
 }catch{/* Audio failure must never stop gameplay. */}
}
