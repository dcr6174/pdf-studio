/**
 * Shared arcade frame for every game: slim bar, pause, fullscreen, feedback, gamepad and end-of-round card.
 * Framework-free. Games drive it through the explicit round protocol in lib/arcade-session.ts; nothing is guessed from DOM text.
 */
import {addFame,cleanInitials,dailySlug,dayKey,levelFromXp,missionsFor,nearMiss,parseFame,parseProgress,qualifies,recordRound,unlockedAt,type Progress} from '../lib/arcade-progress';
import {getMix,setMix,type Mix} from '../lib/arcade-mixer';
import {REPORT_EVENT,beats,isArcadeReport,latestArcadeReport,sendArcadeCommand,type ArcadeReport} from '../lib/arcade-session';
export type FrameGame={slug:string;name:string;instructions?:string};
type Settings={shake:boolean;buzz:boolean;retro:boolean;theme:string};
const PROGRESS='studio-arcade:progress:v1',SETTINGS='studio-arcade:frame:v1';
/** Long enough to see the final shot land; short enough that "one more go" stays instant. */
const END_DELAY=650;
function read<T>(key:string,fallback:T):T{try{const v=localStorage.getItem(key);return v?{...fallback,...JSON.parse(v)}:fallback;}catch{return fallback;}}
function write(key:string,v:unknown){try{localStorage.setItem(key,JSON.stringify(v));}catch{/* Storage is optional. */}}
function h<K extends keyof HTMLElementTagNameMap>(tag:K,attrs:Record<string,string>={},...kids:(Node|string)[]){const el=document.createElement(tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);add(el,...kids);return el;}
/* appendChild keeps DOM typing intact alongside the Workers HTMLRewriter types. */
function add(parent:Node,...kids:(Node|string)[]){for(const k of kids)parent.appendChild(typeof k==='string'?document.createTextNode(k):k);}
function setKids(parent:Node,...kids:(Node|string)[]){while(parent.firstChild)parent.removeChild(parent.firstChild);add(parent,...kids);}
const plural=(n:number,one:string,many:string)=>n+' '+(n===1?one:many);
export function mountGameFrame(root:HTMLElement,opts:{slug:string;games:FrameGame[]}){
 const {slug,games}=opts;const me=games.find(g=>g.slug===slug);const name=me?.name??document.querySelector('h1')?.textContent??'Game';
 const idx=games.findIndex(g=>g.slug===slug),next=games[(idx+1)%games.length]??games[0];
 const today=dayKey(new Date()),daily=dailySlug(today,games.map(g=>g.slug));
 let settings:Settings=read(SETTINGS,{shake:true,buzz:true,retro:false,theme:'default'});
 const reduceOS=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let hasSettings=false;try{hasSettings=!!localStorage.getItem(SETTINGS);}catch{}
 if(reduceOS&&!hasSettings)settings={...settings,shake:false,buzz:false};
 let progress:Progress=parseProgress((()=>{try{return localStorage.getItem(PROGRESS);}catch{return null;}})());
 let fame=parseFame((()=>{try{return localStorage.getItem('studio-arcade:fame:'+slug);}catch{return null;}})());
 let report:ArcadeReport|null=null,shown=0,lastGain=0,combo=0,rounds=0,endTimer=0,disposed=false,recorded=false;
 root.classList.add('gf-on');
 const layer=h('div',{class:'gf-layer','aria-hidden':'true'});
 const bar=h('div',{class:'gf-bar',role:'toolbar','aria-label':'Game controls'});
 const back=h('a',{class:'gf-btn gf-back',href:'/lab/arcade','aria-label':'All games'},'←');
 const title=h('strong',{class:'gf-title'},name);
 const scoreEl=h('span',{class:'gf-score','aria-live':'off'},'0');
 const bestEl=h('span',{class:'gf-best'},'');
 const detailEl=h('span',{class:'gf-detail','aria-live':'off'});detailEl.hidden=true;
 const comboEl=h('span',{class:'gf-combo'});
 const levelEl=h('span',{class:'gf-level',title:'Player level'},'Lv '+levelFromXp(progress.xp).level);
 const status=h('span',{class:'gf-sr',role:'status','aria-live':'polite'});
 const pauseBtn=h('button',{class:'gf-btn',type:'button','aria-label':'Pause (P)',disabled:''},'❚❚');
 const soundBtn=h('button',{class:'gf-btn gf-sound',type:'button','aria-label':'Sound','aria-pressed':'false'},'🔇');soundBtn.hidden=true;
 const fsBtn=h('button',{class:'gf-btn',type:'button','aria-label':'Full screen (F)'},'⛶');
 const menuBtn=h('button',{class:'gf-btn',type:'button','aria-label':'Arcade menu','aria-expanded':'false'},'☰');
 const chips=h('div',{class:'gf-chips'});
 if(daily===slug)add(chips,h('span',{class:'gf-chip gf-daily'},'★ Today’s challenge · +20 XP'));
 if(progress.streak>0)add(chips,h('span',{class:'gf-chip'},'🔥 '+progress.streak+'-day streak'));
 const scoreWrap=h('span',{class:'gf-score-wrap'},scoreEl,comboEl);
 add(bar,back,h('div',{class:'gf-name'},title,chips),h('div',{class:'gf-stats'},detailEl,scoreWrap,bestEl,levelEl),h('div',{class:'gf-actions'},soundBtn,pauseBtn,fsBtn,menuBtn),status);
 if(!document.fullscreenEnabled)fsBtn.hidden=true;
 const sheet=h('div',{class:'gf-sheet',role:'dialog','aria-modal':'true','aria-label':'Arcade menu'});sheet.hidden=true;
 const pauseCard=h('div',{class:'gf-sheet gf-pause',role:'dialog','aria-label':'Paused'});pauseCard.hidden=true;
 const endCard=h('div',{class:'gf-sheet gf-end',role:'dialog','aria-label':'Round over'});endCard.hidden=true;
 root.insertBefore(bar,root.firstChild);add(root,layer,sheet,pauseCard,endCard);
 const applySettings=()=>{root.dataset.gfTheme=settings.theme;root.classList.toggle('gf-retro',settings.retro);root.classList.toggle('gf-calm-motion',!settings.shake);write(SETTINGS,settings);};applySettings();
 const action=()=>report?.feel==='action';
 const buzz=(p:number|number[])=>{if(settings.buzz&&action())try{navigator.vibrate?.(p);}catch{}};
 const shake=(big:boolean)=>{if(!settings.shake||!action())return;root.classList.remove('gf-shake','gf-shake-big');void root.offsetWidth;root.classList.add(big?'gf-shake-big':'gf-shake');setTimeout(()=>root.classList.remove('gf-shake','gf-shake-big'),big?420:240);};
 const floatText=(text:string,big:boolean)=>{const r=scoreWrap.getBoundingClientRect();const f=h('span',{class:'gf-float'+(big?' gf-float-big':'')},text);f.style.left=(r.left+r.width/2)+'px';f.style.top=(r.bottom+44)+'px';add(layer,f);setTimeout(()=>f.remove(),900);};
 const flash=()=>{if(!settings.shake||!action())return;const f=h('div',{class:'gf-flash'});add(layer,f);setTimeout(()=>f.remove(),260);};
 const target=()=>report?.score??0;
 const tick=()=>{const t=target();if(shown===t)return;const step=Math.max(1,Math.ceil(Math.abs(t-shown)/6));shown=shown<t?Math.min(t,shown+step):Math.max(t,shown-step);scoreEl.textContent=String(shown);};
 const pop=(el:Element)=>{el.classList.remove('gf-pop');void (el as HTMLElement).offsetWidth;el.classList.add('gf-pop');};
 /** Feedback scaled to the moment: calm games get a quiet pop; action games get floats, combos, shake and vibration for big hits. */
 const gain=(delta:number,r:ArcadeReport)=>{
  pop(scoreEl);
  if(r.feel!=='action'){floatText('+'+delta,false);return;}
  const now=performance.now();combo=now-lastGain<1400?combo+1:1;lastGain=now;const big=delta>=6||combo>=5;
  floatText('+'+delta,big);comboEl.textContent=combo>=3?'×'+combo:'';comboEl.classList.toggle('gf-combo-on',combo>=3);
  if(big){shake(delta>=6);flash();buzz([18,30,18]);}else buzz(8);
  if(r.scoreKind==='points'&&r.best>0&&r.score>r.best&&r.score-delta<=r.best){floatText('NEW BEST!',true);buzz([30,40,30]);}
 };
 const bestText=(r:ArcadeReport,value=r.best)=>r.scoreKind==='outcome'?plural(progress.wins[slug]??0,'win','wins'):value>0?(r.scoreKind==='strokes'?'Best '+plural(value,'stroke','strokes'):'Best '+value):'No best yet';
 const resumeBtn=h('button',{class:'gf-primary',type:'button'},'▶ Resume');
 const restartBtn=()=>{const b=h('button',{class:'gf-toggle gf-restart',type:'button'},report?.scoreKind==='outcome'?'↻ New game':'↻ Restart round');b.addEventListener('click',()=>{hidePause();sheet.hidden=true;menuBtn.setAttribute('aria-expanded','false');hideEnd();sendArcadeCommand(slug,'restart');});return b;};
 function showPause(){
  if(!report||!endCard.hidden)return;const r=report;
  const line=r.scoreKind==='outcome'?r.message:(r.scoreKind==='strokes'?'Strokes ':'Score ')+r.score+' · '+bestText(r);
  setKids(pauseCard,h('h2',{},'Paused'),h('p',{},line),resumeBtn,h('div',{class:'gf-row'},restartBtn()),h('div',{class:'gf-row'},h('a',{class:'gf-link',href:'/lab/arcade'},'All games'),h('a',{class:'gf-link',href:'/lab/arcade/'+next.slug},'Next: '+next.name)));
  pauseCard.hidden=false;resumeBtn.focus();
 }
 const hidePause=()=>{pauseCard.hidden=true;};
 const pause=()=>{if(report?.canPause&&report.phase==='playing')sendArcadeCommand(slug,'pause');};
 const resume=()=>{hidePause();if(report?.phase==='paused')sendArcadeCommand(slug,'resume');};
 const togglePause=()=>{if(report?.phase==='paused')resume();else pause();};
 resumeBtn.addEventListener('click',resume);
 pauseBtn.addEventListener('click',togglePause);
 soundBtn.addEventListener('click',()=>sendArcadeCommand(slug,'sound'));
 const fs=()=>{if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});else void root.requestFullscreen?.().catch(()=>{});};
 fsBtn.addEventListener('click',fs);
 const onFs=()=>root.classList.toggle('gf-full',document.fullscreenElement===root);document.addEventListener('fullscreenchange',onFs);
 const toggleRow=(label:string,key:'shake'|'buzz'|'retro',locked=false)=>{const b=h('button',{type:'button',class:'gf-toggle','aria-pressed':String(settings[key])},label+(locked?' 🔒 Lv 5':''));if(locked)b.setAttribute('disabled','');b.addEventListener('click',()=>{settings={...settings,[key]:!settings[key]};b.setAttribute('aria-pressed',String(settings[key]));applySettings();});return b;};
 const kind=()=>report?.scoreKind??'points';
 function openMenu(){const level=levelFromXp(progress.xp),owned=new Set<string>(unlockedAt(level.level).map(u=>u.id));const ms=missionsFor(report?.best??0,kind()),done=new Set(progress.missions[slug]??[]);
  const themes=h('div',{class:'gf-row'});for(const [id,label] of [['default','Classic'],['theme-sunset','Sunset'],['theme-midnight','Midnight'],['theme-champion','Champion']] as const){const ok=id==='default'||owned.has(id);const b=h('button',{type:'button',class:'gf-toggle','aria-pressed':String(settings.theme===id)},label+(ok?'':' 🔒'));if(!ok)b.setAttribute('disabled','');b.addEventListener('click',()=>{settings={...settings,theme:id};applySettings();openMenu();});add(themes,b);}
  const lower=kind()==='strokes';
  setKids(sheet,h('div',{class:'gf-sheet-head'},h('h2',{},'Arcade menu'),closeBtn),
   report&&report.phase!=='ready'?h('div',{class:'gf-row'},restartBtn()):'',
   me?.instructions?h('section',{},h('h3',{},'How to play'),h('p',{class:'gf-how'},me.instructions)):'',
   h('section',{},h('h3',{},'Level '+level.level),h('div',{class:'gf-meter'},meter(level.into/level.need)),h('p',{},level.into+' / '+level.need+' XP to level '+(level.level+1))),
   h('section',{},h('h3',{},'Missions'),h('ul',{class:'gf-missions'},...ms.map(m=>h('li',{class:done.has(m.id)?'gf-done':''},(done.has(m.id)?'✓ ':'○ ')+m.label+' · +30 XP')))),
   kind()==='outcome'?h('section',{},h('h3',{},'Record'),h('p',{},plural(progress.plays[slug]??0,'game','games')+' finished · '+plural(progress.wins[slug]??0,'win','wins'))):
   h('section',{},h('h3',{},'Hall of fame'+(lower?' · fewest strokes':'')),fame.length?h('ol',{class:'gf-fame'},...fame.map(f=>h('li',{},h('b',{},f.initials),' '+f.score))):h('p',{},'No entries yet. Finish a round to sign the board.')),
   h('section',{},h('h3',{},'Sound mix'),report?.sound===null?h('p',{},'This game has no sound.'):'',h('div',{class:'gf-mix'},...mixRows())),
   h('section',{},h('h3',{},'Comfort'),h('div',{class:'gf-row'},toggleRow('Screen shake & flashes','shake'),toggleRow('Vibration','buzz'),toggleRow('Retro mode','retro',!owned.has('retro')))),
   h('section',{},h('h3',{},'Theme'),themes),
   h('p',{class:'gf-keys'},(report?.letterKeys?'Letter keys type in this game. ':'Keys: P pause · F full screen. ')+'Esc closes this menu. Gamepad: stick/D-pad move, A action, Start pause.'));
  sheet.hidden=false;menuBtn.setAttribute('aria-expanded','true');closeBtn.focus();}
 /** Volume sliders shared by every game; they take effect immediately and persist on this device. */
 const mixRows=()=>{const m=getMix();return ([['master','Master'],['sfx','Game sounds'],['ui','Taps & menus'],['ambience','Crowd & ambience']] as const).map(([key,label])=>{
  const id='gf-mix-'+key,input=h('input',{type:'range',min:'0',max:'100',step:'5',id,value:String(Math.round(m[key]*100)),'aria-valuetext':Math.round(m[key]*100)+'%'}) as HTMLInputElement;
  const out=h('output',{for:id},Math.round(m[key]*100)+'%');
  input.addEventListener('input',()=>{const v=Number(input.value)/100;setMix({[key]:v} as Partial<Mix>);out.textContent=input.value+'%';input.setAttribute('aria-valuetext',input.value+'%');});
  return h('label',{class:'gf-mix-row',for:id},h('span',{},label),input,out);});};
 const meter=(f:number)=>{const i=h('i',{});i.style.width=Math.round(Math.max(0,Math.min(1,f))*100)+'%';return i;};
 const closeBtn=h('button',{class:'gf-btn',type:'button','aria-label':'Close menu'},'✕');
 closeBtn.addEventListener('click',()=>{sheet.hidden=true;menuBtn.setAttribute('aria-expanded','false');menuBtn.focus();});
 menuBtn.addEventListener('click',()=>sheet.hidden?openMenu():closeBtn.click());
 function hideEnd(){clearTimeout(endTimer);endTimer=0;endCard.hidden=true;}
 /** Records the round exactly once and shows the shared result card. */
 function showEnd(r:ArcadeReport,previousBest:number){
  rounds++;root.dataset.gfRounds=String(rounds);
  const k=r.scoreKind,lower=k==='strokes';
  const res=recordRound(progress,{slug,score:r.score,previousBest,day:today,kind:k,won:r.won},daily);progress=res.progress;write(PROGRESS,progress);
  const record=beats(k,r.score,previousBest);
  const bestNow=record?r.score:k==='strokes'?(r.best||previousBest):Math.max(r.best,previousBest);
  const level=levelFromXp(progress.xp);levelEl.textContent='Lv '+level.level;bestEl.textContent=bestText(r,bestNow);
  const near=nearMiss(r.score,previousBest,k);
  const again=h('button',{class:'gf-primary',type:'button'},r.againLabel??(k==='outcome'?'↻ Rematch':'↻ Play again'));
  again.addEventListener('click',()=>{hideEnd();sendArcadeCommand(slug,'restart');});
  const kicker=k==='outcome'?(r.won===true?'YOU WIN':r.won===false?'YOU LOSE':'GAME OVER'):record&&previousBest>0?'NEW BEST!':res.daily?'TODAY’S CHALLENGE':r.won===true?'COMPLETE':'ROUND OVER';
  const headline=k==='outcome'?(r.won===true?'🏆':r.won===false?'🏳️':'🤝'):String(r.score);
  const kids:(Node|string)[]=[h('button',{class:'gf-btn gf-x',type:'button','aria-label':'Show the game'},'✕'),
   h('p',{class:'gf-kicker'},kicker),h('div',{class:'gf-big'+(k==='outcome'?' gf-big-icon':'')},headline),
   lower?h('p',{class:'gf-unit'},'strokes'):'',
   r.message?h('p',{class:'gf-msg'},r.message):'',
   k!=='outcome'?h('p',{},bestText(r,bestNow)+(res.daily?' · Today’s best '+(progress.dailyBest[today]??r.score):'')):'',
   near?h('p',{class:'gf-near'},near):'',
   h('div',{class:'gf-xp'},h('span',{},'+'+res.xp+' XP'),h('div',{class:'gf-meter'},meter(level.into/level.need)),h('span',{},'Lv '+level.level)),
   ...res.missions.map(m=>h('p',{class:'gf-unlock'},'✓ Mission: '+m)),
   res.levelUp?h('p',{class:'gf-unlock'},'▲ Level '+res.levelUp+'!'):'',
   ...res.unlocked.map(u=>h('p',{class:'gf-unlock'},'🎁 Unlocked: '+u)),
   progress.streak>1?h('p',{},'🔥 '+progress.streak+'-day streak'):''];
  if(k!=='outcome'&&qualifies(fame,r.score,lower)){const input=h('input',{maxlength:'3',placeholder:'AAA','aria-label':'Your initials',autocapitalize:'characters',class:'gf-initials'}) as HTMLInputElement;const save=h('button',{type:'button',class:'gf-toggle'},'Sign');const form=h('div',{class:'gf-row gf-sign'},h('span',{},'Hall of fame! Your initials:'),input,save);
   const sign=()=>{fame=addFame(fame,{initials:cleanInitials(input.value),score:r.score,date:today},lower);write('studio-arcade:fame:'+slug,fame);form.parentNode?.replaceChild(h('ol',{class:'gf-fame'},...fame.map(f=>h('li',{},h('b',{},f.initials),' '+f.score))),form);again.focus();};
   save.addEventListener('click',sign);input.addEventListener('keydown',e=>{if(e.key==='Enter')sign();});kids.push(form);}
  kids.push(again,h('div',{class:'gf-row'},h('a',{class:'gf-link',href:'/lab/arcade/'+next.slug+'?play=1'},'Next game: '+next.name+' →'),h('a',{class:'gf-link',href:'/lab/arcade'},'All games')));
  setKids(endCard,...kids);endCard.querySelector('.gf-x')?.addEventListener('click',hideEnd);hidePause();endCard.hidden=false;again.focus();
  status.textContent=kicker+'. '+(k==='outcome'?r.message:(lower?'Strokes ':'Score ')+r.score);
  if(record&&previousBest>0){shake(true);buzz([40,40,40]);}
 }
 /** One report in, one state change out. */
 let roundBest=0;
 const apply=(r:ArcadeReport)=>{
  const prev=report;report=r;root.dataset.gfPhase=r.phase;root.dataset.gfKind=r.scoreKind;root.dataset.gfScore=String(r.score);
  root.classList.toggle('gf-outcome',r.scoreKind==='outcome');
  if(!prev){shown=r.score;scoreEl.textContent=String(r.score);roundBest=r.best;}
  if(r.phase==='playing'&&prev&&prev.phase==='playing'&&r.score>prev.score)gain(r.score-prev.score,r);
  const reset=!prev||(prev.phase==='over'&&r.phase!=='over')||(r.phase==='ready'&&prev.phase!=='ready');
  if(reset){hideEnd();recorded=false;combo=0;comboEl.textContent='';comboEl.classList.remove('gf-combo-on');roundBest=r.best;if(r.score<shown){shown=r.score;scoreEl.textContent=String(r.score);}}
  if(r.phase==='ready')roundBest=r.best;
  bestEl.textContent=bestText(r);
  detailEl.hidden=!r.detail;detailEl.textContent=r.detail??'';
  const pausable=r.canPause&&(r.phase==='playing'||r.phase==='paused');
  pauseBtn.toggleAttribute('disabled',!pausable);pauseBtn.textContent=r.phase==='paused'?'▶':'❚❚';pauseBtn.setAttribute('aria-label',r.phase==='paused'?'Resume (P)':'Pause (P)');
  soundBtn.hidden=r.sound===null;soundBtn.textContent=r.sound?'🔊':'🔇';soundBtn.setAttribute('aria-pressed',String(!!r.sound));soundBtn.setAttribute('aria-label',r.sound?'Sound on — tap to mute':'Sound off — tap to turn on');
  root.classList.toggle('gf-has-sound',r.sound!==null);
  if(r.phase==='paused')showPause();else hidePause();
  if(!prev||prev.phase!==r.phase)requestAnimationFrame(()=>fit(true));
  if(r.phase==='over'&&!recorded){recorded=true;const previousBest=roundBest;clearTimeout(endTimer);endTimer=window.setTimeout(()=>{endTimer=0;if(!disposed&&report?.phase==='over')showEnd(report,previousBest);},END_DELAY);}
 };
 const onReport=(event:Event)=>{const d=(event as CustomEvent<unknown>).detail;if(isArcadeReport(d)&&d.slug===slug)apply(d);};
 window.addEventListener(REPORT_EVENT,onReport);
 const first=latestArcadeReport(slug);if(first)apply(first);
 /* Fit-to-screen: DOM-built play surfaces (boards, trays, scenes) scale as one piece to the space under the bar,
    keeping their proportions. Canvas and stadium games size themselves from --gf-avail in CSS instead. */
 const FIT='.fresh-active-scene,.club-play-inner,.puzzle-workspace';
 const SELF_SIZED='.play-cricket,.rooftop-stage,.arcade-stage';
 let pointerDown=false,lastFit=0;
 const onDown=()=>{pointerDown=true;},onUp=()=>{pointerDown=false;};
 root.addEventListener('pointerdown',onDown,true);window.addEventListener('pointerup',onUp,true);window.addEventListener('pointercancel',onUp,true);
 const setAvail=()=>{const b=bar.getBoundingClientRect().height;root.style.setProperty('--gf-avail',Math.max(240,Math.round(innerHeight-b-8))+'px');root.style.setProperty('--gf-bar-h',Math.round(b)+'px');};
 /* Fluid surfaces (SVG or canvas at 100% width) get taller as they get wider, so zoom cannot shrink them.
    Narrow them instead until they fit under the bar; if narrowing does not help, leave them as they are. */
 /* A phone held sideways cannot show some upright games in full even after fitting; say so once, without blocking play. */
 const rotateClose=h('button',{type:'button','aria-label':'Dismiss tip'},'✕');
 const rotateTip=h('div',{class:'gf-rotate',role:'status'},h('span',{},'Turn your phone upright to see the whole game.'),rotateClose);
 rotateTip.hidden=true;let rotateDismissed=false;add(root,rotateTip);
 rotateClose.addEventListener('click',()=>{rotateTip.hidden=true;rotateDismissed=true;});
 function rotateHint(overflowing:boolean){
  const sideways=matchMedia('(orientation: landscape) and (max-height: 600px) and (pointer: coarse)').matches;
  rotateTip.hidden=rotateDismissed||!(sideways&&overflowing);
 }
 function fitWidth(el:HTMLElement,avail:number){
  const narrow=(w:string)=>{if(w){el.style.setProperty('max-width',w,'important');el.style.setProperty('margin-inline','auto','important');}else{el.style.removeProperty('max-width');el.style.removeProperty('margin-inline');}};
  narrow('');
  const first=el.getBoundingClientRect();if(first.height<=avail+2){delete el.dataset.gfNarrow;return;}
  const W=first.width;let lo=W*.25,hi=W,best=0;
  for(let i=0;i<7;i++){
   const mid=(lo+hi)/2;narrow(mid+'px');
   if(el.getBoundingClientRect().height<=avail+2){best=mid;lo=mid;}else hi=mid;
  }
  if(!best){narrow('');delete el.dataset.gfNarrow;return;}
  narrow(Math.floor(best)+'px');el.dataset.gfNarrow='1';
 }
 function fit(force=false){
  setAvail();
  const el=root.querySelector<HTMLElement>(FIT);if(!el||el.querySelector(SELF_SIZED)){root.dataset.gfZoom='1';return;}
  const now=performance.now();if(!force&&(pointerDown||now-lastFit<1500))return;
  const touch=matchMedia('(pointer: coarse)').matches,minZ=touch?.8:.7,maxZ=touch?1.35:1.9;
  const rendered=el.getBoundingClientRect(),avail=innerHeight-(rendered.top+scrollY)-10;
  const current=Number(el.dataset.gfZoom||'1');
  // Only refit when the surface overflows the screen or leaves a lot of it unused.
  if(!force&&rendered.bottom<=innerHeight+4&&rendered.height>=avail*.86)return;
  if(!force&&(el.dataset.gfFluid||el.dataset.gfNarrow)&&rendered.bottom<=innerHeight+4)return;
  lastFit=now;el.style.zoom='';el.style.removeProperty('max-width');el.style.removeProperty('margin-inline');
  const h1=el.getBoundingClientRect().height;if(h1<40||avail<120)return;
  let z=Math.max(minZ,Math.min(maxZ,avail/h1)),fluid=false;
  for(let i=0;i<3;i++){
   el.style.zoom=String(z);const h=el.getBoundingClientRect().height;
   // Fluid content barely changes size with zoom; scaling it only resizes the text, so leave it at 1.
   if(z>1&&h<h1*(1+(z-1)*.6)||z<1&&h>h1*(1-(1-z)*.5)){z=1;fluid=true;break;}
   const wide=el.scrollWidth>el.clientWidth+2?el.clientWidth/el.scrollWidth:1;
   const next=Math.max(minZ,Math.min(maxZ,z*Math.min(avail/h,1)*wide));
   if(Math.abs(next-z)<.01)break;z=next;
  }
  z=Math.round(z*100)/100;el.style.zoom=z===1?'':String(z);el.dataset.gfZoom=String(z);root.dataset.gfZoom=String(z);
  if(fluid)el.dataset.gfFluid='1';else delete el.dataset.gfFluid;
  // Zoom alone could not make it fit (already at the smallest readable zoom): narrow it as well.
  if(z===1||el.getBoundingClientRect().height>avail+2)fitWidth(el,avail);else delete el.dataset.gfNarrow;
  rotateHint(el.getBoundingClientRect().height>avail*1.15);
  if(Math.abs(z-current)>.01||el.dataset.gfNarrow)root.dispatchEvent(new CustomEvent('studio-arcade:refit'));
 }
 const onResize=()=>{fit(true);};
 window.addEventListener('resize',onResize);
 let raf=0,lastCheck=0;
 const loop=(now:number)=>{if(disposed)return;raf=requestAnimationFrame(loop);tick();pollPad();if(now-lastCheck>700){lastCheck=now;fit();}};
 raf=requestAnimationFrame(loop);
 // Gamepad → keyboard events the games already understand.
 const held=new Set<string>();
 const send=(key:string,down:boolean)=>{if(down===held.has(key))return;if(down)held.add(key);else held.delete(key);const target=document.activeElement&&root.contains(document.activeElement)?document.activeElement:root.querySelector<HTMLElement>('[tabindex],canvas')??window;target.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key,code:key===' '?'Space':key,bubbles:true}));};
 let startHeld=false;
 function pollPad(){const pads=navigator.getGamepads?.();const p=pads&&Array.from(pads).find(Boolean);if(!p)return;const ax=p.axes[0]??0,ay=p.axes[1]??0,btn=(i:number)=>!!p.buttons[i]?.pressed;
  send('ArrowLeft',ax<-.5||btn(14));send('ArrowRight',ax>.5||btn(15));send('ArrowUp',ay<-.5||btn(12));send('ArrowDown',ay>.5||btn(13));send(' ',btn(0));
  if(btn(9)&&!startHeld)togglePause();startHeld=btn(9);}
 const onKey=(e:KeyboardEvent)=>{
  const t=e.target as HTMLElement|null;if(t?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  if(e.key==='Escape'&&!sheet.hidden){closeBtn.click();return;}
  if(e.ctrlKey||e.metaKey||e.altKey||report?.letterKeys)return;
  if(e.key==='p'||e.key==='P'){e.preventDefault();togglePause();}
  if((e.key==='f'||e.key==='F')&&!fsBtn.hidden){e.preventDefault();fs();}
 };
 window.addEventListener('keydown',onKey);
 // Rotating a phone or hiding the tab mid-round pauses cleanly; the game's own state is never lost.
 const onRotate=()=>pause();
 const onHide=()=>{if(document.hidden)pause();};
 screen.orientation?.addEventListener?.('change',onRotate);document.addEventListener('visibilitychange',onHide);
 return ()=>{disposed=true;cancelAnimationFrame(raf);clearTimeout(endTimer);window.removeEventListener(REPORT_EVENT,onReport);window.removeEventListener('keydown',onKey);window.removeEventListener('resize',onResize);root.removeEventListener('pointerdown',onDown,true);window.removeEventListener('pointerup',onUp,true);window.removeEventListener('pointercancel',onUp,true);const fitEl=root.querySelector<HTMLElement>(FIT);if(fitEl){for(const k of ['zoom','max-width','margin-inline'])fitEl.style.removeProperty(k);delete fitEl.dataset.gfZoom;delete fitEl.dataset.gfFluid;delete fitEl.dataset.gfNarrow;}document.removeEventListener('fullscreenchange',onFs);document.removeEventListener('visibilitychange',onHide);screen.orientation?.removeEventListener?.('change',onRotate);for(const el of [bar,layer,sheet,pauseCard,endCard,rotateTip])el.remove();root.classList.remove('gf-on','gf-retro','gf-calm-motion','gf-outcome');};
}
