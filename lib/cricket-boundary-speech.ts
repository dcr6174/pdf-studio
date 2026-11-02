import {getMix,gainFor} from './arcade-mixer';

let current:SpeechSynthesisUtterance|null=null;
export function boundarySpeechSupported(){return typeof window!=='undefined'&&typeof window.speechSynthesis?.speak==='function'&&typeof window.SpeechSynthesisUtterance==='function';}
export function stopCricketSpeech(){if(!current)return;current=null;try{window.speechSynthesis.cancel();}catch{/* Optional speech cannot interrupt a match. */}}
/** Web Speech cannot connect to Web Audio buses. Mirror master/SFX gains, use
 * only an English device voice, and cancel on mixer changes in the game shell. */
export function announceCricketBoundary(runs:4|6):boolean{
 if(!boundarySpeechSupported())return false;
 const mix=getMix(),volume=gainFor(mix.master)*gainFor(mix.sfx);
 if(volume<=0){stopCricketSpeech();return false;}
 try{
  const voice=window.speechSynthesis.getVoices().find(v=>v.localService&&/^en(?:-|$)/i.test(v.lang));
  if(!voice)return false;
  stopCricketSpeech();
  const utterance=new window.SpeechSynthesisUtterance(runs===6?'Six!':'Four!');
  utterance.voice=voice;utterance.lang=voice.lang;utterance.volume=Math.min(1,volume);utterance.rate=1.15;
  utterance.onend=utterance.onerror=()=>{if(current===utterance)current=null;};
  current=utterance;window.speechSynthesis.speak(utterance);return true;
 }catch{current=null;return false;}
}
