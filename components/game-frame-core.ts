/** Shared arcade frame for every game: slim bar, pause, fullscreen, game feel, gamepad, end-of-round card. Framework-free so it wraps all game families without changing them. */
import {addFame,cleanInitials,dailySlug,dayKey,levelFromXp,missionsFor,nearMiss,parseFame,parseProgress,qualifies,recordRound,unlockedAt,type Progress} from '../lib/arcade-progress';
export type FrameGame={slug:string;name:string};
type Settings={shake:boolean;buzz:boolean;retro:boolean;theme:string};
const PROGRESS='studio-arcade:progress:v1',SETTINGS='studio-arcade:frame:v1';
const overlaySel='.arcade-stage-overlay,.club-curtain,.puzzle-curtain,.fresh-curtain,.pc-result,.rooftop-result,[class*="-result"],[class*="game-over"],[class*="finish"]';
const againRe=/^(↻\s*)?(play again|new game|try again|rematch|new round|next round|bat again|chase again|one more|restart|replay|new match|new puzzle|next level)/i;
const pauseRe=/^(⏸\s*|ⅱ\s*)?pause/i,resumeRe=/^(▶\s*)?(resume|continue|keep playing)/i;
function read<T>(key:string,fallback:T):T{try{const v=localStorage.getItem(key);return v?{...fallback,...JSON.parse(v)}:fallback;}catch{return fallback;}}
function write(key:string,v:unknown){try{localStorage.setItem(key,JSON.stringify(v));}catch{/* Storage is optional. */}}
const visible=(el:Element)=>{const r=(el as HTMLElement).getBoundingClientRect();if(r.width<2||r.height<2)return false;const s=getComputedStyle(el);return s.visibility!=='hidden'&&s.display!=='none'&&Number(s.opacity)>.05;};
const txt=(el:Element)=>(el.textContent??'').trim();
function h<K extends keyof HTMLElementTagNameMap>(tag:K,attrs:Record<string,string>={},...kids:(Node|string)[]){const el=document.createElement(tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);el.append(...kids);return el;}
function scoreNode(root:Element):HTMLElement|null{
 for(const el of root.querySelectorAll('span,dt,small,label,em')){
  if(el.closest('.gf-layer'))continue;
  const own=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
  if(/^(score|runs|points|pts)$/i.test(own)){const v=el.querySelector('b,strong')??el.nextElementSibling;if(v instanceof HTMLElement)return v;}
 }
 return null;
}
const toNum=(s:string)=>{const m=s.replace(/,/g,'').match(/-?\d+/);return m?Number(m[0]):NaN;};
export function mountGameFrame(root:HTMLElement,opts:{slug:string;games:FrameGame[]}){
 const {slug,games}=opts;const name=games.find(g=>g.slug===slug)?.name??document.querySelector('h1')?.textContent??'Game';
 const idx=games.findIndex(g=>g.slug===slug),next=games[(idx+1)%games.length]??games[0];
 const today=dayKey(new Date()),daily=dailySlug(today,games.map(g=>g.slug));
 let settings:Settings=read(SETTINGS,{shake:true,buzz:true,retro:false,theme:'default'});
 const reduceOS=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduceOS&&!localStorage.getItem(SETTINGS))settings.shake=false;
 let progress:Progress=parseProgress(localStorage.getItem(PROGRESS));
 let best=0;try{best=Math.max(0,Number(localStorage.getItem('studio-arcade:best:'+slug))||0);}catch{}
 let fame=parseFame(localStorage.getItem('studio-arcade:fame:'+slug));
 let score=0,shown=0,started=false,startedAt=0,overShown=false,lastGain=0,combo=0,pausedBy:HTMLElement|null=null,disposed=false;
 root.classList.add('gf-on');
 const layer=h('div',{class:'gf-layer','aria-hidden':'true'});
 const bar=h('div',{class:'gf-bar',role:'toolbar','aria-label':'Game controls'});
 const back=h('a',{class:'gf-btn gf-back',href:'/lab/arcade','aria-label':'All games'},'←');
 const title=h('strong',{class:'gf-title'},name);
 const scoreEl=h('span',{class:'gf-score','aria-live':'off'},'0');
 const bestEl=h('span',{class:'gf-best'},'Best '+best);
 const comboEl=h('span',{class:'gf-combo'});
 const lvl=levelFromXp(progress.xp);
 const levelEl=h('span',{class:'gf-level',title:'Player level'},'Lv '+lvl.level);
 const pauseBtn=h('button',{class:'gf-btn',type:'button','aria-label':'Pause (P)'},'❚❚');
 const fsBtn=h('button',{class:'gf-btn',type:'button','aria-label':'Full screen (F)'},'⛶');
 const menuBtn=h('button',{class:'gf-btn',type:'button','aria-label':'Arcade menu','aria-expanded':'false'},'☰');
 const chips=h('div',{class:'gf-chips'});
 if(daily===slug)chips.append(h('span',{class:'gf-chip gf-daily'},'★ Today’s challenge · +20 XP'));
 if(progress.streak>0)chips.append(h('span',{class:'gf-chip'},'🔥 '+progress.streak+'-day streak'));
 bar.append(back,h('div',{class:'gf-name'},title,chips),h('div',{class:'gf-stats'},h('span',{class:'gf-score-wrap'},scoreEl,comboEl),bestEl,levelEl),h('div',{class:'gf-actions'},pauseBtn,fsBtn,menuBtn));
 if(!document.fullscreenEnabled)fsBtn.hidden=true;
 const sheet=h('div',{class:'gf-sheet',role:'dialog','aria-modal':'true','aria-label':'Arcade menu'});sheet.hidden=true;
 const pauseCard=h('div',{class:'gf-sheet gf-pause',role:'dialog','aria-label':'Paused'});pauseCard.hidden=true;
 const endCard=h('div',{class:'gf-sheet gf-end',role:'dialog','aria-label':'Round over'});endCard.hidden=true;
 root.prepend(bar);root.append(layer,sheet,pauseCard,endCard);
 const applySettings=()=>{root.dataset.gfTheme=settings.theme;root.classList.toggle('gf-retro',settings.retro);write(SETTINGS,settings);};applySettings();
 const buzz=(p:number|number[])=>{if(settings.buzz&&!reduceOS)try{navigator.vibrate?.(p);}catch{}};
 const shake=(big:boolean)=>{if(!settings.shake)return;root.classList.remove('gf-shake','gf-shake-big');void root.offsetWidth;root.classList.add(big?'gf-shake-big':'gf-shake');setTimeout(()=>root.classList.remove('gf-shake','gf-shake-big'),big?420:240);};
 const floatText=(at:HTMLElement|null,text:string,big:boolean)=>{const r=(at&&visible(at)?at:scoreEl).getBoundingClientRect();const f=h('span',{class:'gf-float'+(big?' gf-float-big':'')},text);f.style.left=(r.left+r.width/2)+'px';f.style.top=(r.top)+'px';layer.append(f);setTimeout(()=>f.remove(),900);};
 const flash=()=>{if(!settings.shake)return;const f=h('div',{class:'gf-flash'});layer.append(f);setTimeout(()=>f.remove(),260);};
 const tick=()=>{if(shown===score)return;const step=Math.max(1,Math.ceil(Math.abs(score-shown)/6));shown=shown<score?Math.min(score,shown+step):score;scoreEl.textContent=String(shown);};
 const gain=(delta:number,node:HTMLElement|null)=>{const now=performance.now();combo=now-lastGain<1400?combo+1:1;lastGain=now;const big=delta>=6||combo>=5;
  floatText(node,'+'+delta,big);scoreEl.classList.remove('gf-pop');void scoreEl.offsetWidth;scoreEl.classList.add('gf-pop');node?.classList.remove('gf-pop');void node?.offsetWidth;node?.classList.add('gf-pop');
  comboEl.textContent=combo>=3?'×'+combo:'';comboEl.classList.toggle('gf-combo-on',combo>=3);
  if(big){shake(delta>=6);flash();buzz([18,30,18]);}else buzz(8);
  if(score>best&&best>0&&score-delta<=best){floatText(null,'NEW BEST!',true);buzz([30,40,30]);}
 };
 const markStart=()=>{if(!started){started=true;startedAt=performance.now();}};
 const findBtn=(re:RegExp,scope:Element=root)=>Array.from(scope.querySelectorAll<HTMLButtonElement>('button')).find(b=>!b.closest('.gf-bar,.gf-sheet')&&!b.disabled&&re.test(txt(b))&&visible(b));
 const onClick=(e:Event)=>{const t=e.target as Element;if(t.closest('.gf-bar,.gf-sheet'))return;if(t.closest('button,canvas,[role="button"],.arcade-board'))markStart();if(overShown&&t.closest('button')&&againRe.test(txt(t.closest('button')!)))hideEnd();};
 root.addEventListener('pointerdown',onClick,true);
 const keyStart=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))markStart();};window.addEventListener('keydown',keyStart);
 function pause(){if(!pauseCard.hidden||!endCard.hidden)return;const b=findBtn(pauseRe);if(b){pausedBy=b;b.click();}else{pausedBy=null;window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));}
  pauseCard.replaceChildren(h('h2',{},'Paused'),h('p',{},'Score '+score+' · Best '+Math.max(best,score)),resumeBtn,h('div',{class:'gf-row'},h('a',{class:'gf-link',href:'/lab/arcade'},'All games'),h('a',{class:'gf-link',href:'/lab/arcade/'+next.slug},'Next: '+next.name)));pauseCard.hidden=false;resumeBtn.focus();}
 const resumeBtn=h('button',{class:'gf-primary',type:'button'},'▶ Resume');
 resumeBtn.addEventListener('click',()=>{pauseCard.hidden=true;const r=findBtn(resumeRe);if(r)r.click();else if(pausedBy&&pausedBy.isConnected&&visible(pausedBy)&&!pauseRe.test(txt(pausedBy)))pausedBy.click();pausedBy=null;});
 pauseBtn.addEventListener('click',pause);
 const fs=()=>{if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});else void root.requestFullscreen?.().catch(()=>{});};
 fsBtn.addEventListener('click',fs);
 const onFs=()=>root.classList.toggle('gf-full',document.fullscreenElement===root);document.addEventListener('fullscreenchange',onFs);
 const toggleRow=(label:string,key:'shake'|'buzz'|'retro',locked=false)=>{const b=h('button',{type:'button',class:'gf-toggle','aria-pressed':String(settings[key])},label+(locked?' 🔒 Lv 5':''));if(locked)b.setAttribute('disabled','');b.addEventListener('click',()=>{settings={...settings,[key]:!settings[key]};b.setAttribute('aria-pressed',String(settings[key]));applySettings();});return b;};
 function openMenu(){const level=levelFromXp(progress.xp),owned=new Set<string>(unlockedAt(level.level).map(u=>u.id));const ms=missionsFor(best),done=new Set(progress.missions[slug]??[]);
  const themes=h('div',{class:'gf-row'});for(const [id,label] of [['default','Classic'],['theme-sunset','Sunset'],['theme-midnight','Midnight'],['theme-champion','Champion']] as const){const ok=id==='default'||owned.has(id);const b=h('button',{type:'button',class:'gf-toggle','aria-pressed':String(settings.theme===id)},label+(ok?'':' 🔒'));if(!ok)b.setAttribute('disabled','');b.addEventListener('click',()=>{settings={...settings,theme:id};applySettings();openMenu();});themes.append(b);}
  sheet.replaceChildren(h('div',{class:'gf-sheet-head'},h('h2',{},'Arcade menu'),closeBtn),
   h('section',{},h('h3',{},'Level '+level.level),h('div',{class:'gf-meter'},meter(level.into/level.need)),h('p',{},level.into+' / '+level.need+' XP to level '+(level.level+1))),
   h('section',{},h('h3',{},'Missions'),h('ul',{class:'gf-missions'},...ms.map(m=>h('li',{class:done.has(m.id)?'gf-done':''},(done.has(m.id)?'✓ ':'○ ')+m.label+' · +30 XP')))),
   h('section',{},h('h3',{},'Hall of fame'),fame.length?h('ol',{class:'gf-fame'},...fame.map(f=>h('li',{},h('b',{},f.initials),' '+f.score))):h('p',{},'No entries yet. Finish a round to sign the board.')),
   h('section',{},h('h3',{},'Feel'),h('div',{class:'gf-row'},toggleRow('Screen shake & flashes','shake'),toggleRow('Vibration','buzz'),toggleRow('Retro mode','retro',!owned.has('retro')))),
   h('section',{},h('h3',{},'Theme'),themes),
   h('p',{class:'gf-keys'},'Keys: P pause · F full screen · Esc close. Gamepad: stick/D-pad move, A action, Start pause.'));
  sheet.hidden=false;menuBtn.setAttribute('aria-expanded','true');closeBtn.focus();}
 const meter=(f:number)=>{const i=h('i',{});i.style.width=Math.round(Math.max(0,Math.min(1,f))*100)+'%';return i;};
 const closeBtn=h('button',{class:'gf-btn',type:'button','aria-label':'Close menu'},'✕');
 closeBtn.addEventListener('click',()=>{sheet.hidden=true;menuBtn.setAttribute('aria-expanded','false');});
 menuBtn.addEventListener('click',()=>sheet.hidden?openMenu():closeBtn.click());
 function hideEnd(){endCard.hidden=true;}
 function showEnd(){
  overShown=true;const prevBest=best;const res=recordRound(progress,{slug,score,previousBest:prevBest,day:today},daily);progress=res.progress;write(PROGRESS,progress);
  best=Math.max(best,score);bestEl.textContent='Best '+best;const level=levelFromXp(progress.xp);levelEl.textContent='Lv '+level.level;
  const near=nearMiss(score,prevBest);
  const again=h('button',{class:'gf-primary',type:'button'},'↻ Play again');
  again.addEventListener('click',()=>{hideEnd();const b=findBtn(againRe);if(b)b.click();else window.location.reload();});
  const kids:(Node|string)[]=[h('button',{class:'gf-btn gf-x',type:'button','aria-label':'Show the game'},'✕'),
   h('p',{class:'gf-kicker'},score>prevBest&&score>0?'NEW BEST!':res.daily?'TODAY’S CHALLENGE':'ROUND OVER'),
   h('div',{class:'gf-big'},String(score)),h('p',{},'Best '+best+(res.daily?' · Today’s best '+(progress.dailyBest[today]??score):'')),
   near?h('p',{class:'gf-near'},near):'',
   h('div',{class:'gf-xp'},h('span',{},'+'+res.xp+' XP'),h('div',{class:'gf-meter'},meter(level.into/level.need)),h('span',{},'Lv '+level.level)),
   ...res.missions.map(m=>h('p',{class:'gf-unlock'},'✓ Mission: '+m)),
   res.levelUp?h('p',{class:'gf-unlock'},'▲ Level '+res.levelUp+'!'):'',
   ...res.unlocked.map(u=>h('p',{class:'gf-unlock'},'🎁 Unlocked: '+u)),
   progress.streak>1?h('p',{},'🔥 '+progress.streak+'-day streak'):''];
  if(qualifies(fame,score)){const input=h('input',{maxlength:'3',placeholder:'AAA','aria-label':'Your initials',autocapitalize:'characters',class:'gf-initials'}) as HTMLInputElement;const save=h('button',{type:'button',class:'gf-toggle'},'Sign');const form=h('div',{class:'gf-row gf-sign'},h('span',{},'Hall of fame! Your initials:'),input,save);
   save.addEventListener('click',()=>{fame=addFame(fame,{initials:cleanInitials(input.value),score,date:today});write('studio-arcade:fame:'+slug,fame);form.replaceWith(h('ol',{class:'gf-fame'},...fame.map(f=>h('li',{},h('b',{},f.initials),' '+f.score))));});kids.push(form);}
  kids.push(again,h('div',{class:'gf-row'},h('a',{class:'gf-link',href:'/lab/arcade/'+next.slug+'?play=1'},'Next game: '+next.name+' →'),h('a',{class:'gf-link',href:'/lab/arcade'},'All games')));
  endCard.replaceChildren(...kids);endCard.querySelector('.gf-x')?.addEventListener('click',hideEnd);endCard.hidden=false;
  if(score>prevBest&&prevBest>0){shake(true);buzz([40,40,40]);}
 }
 const finished=()=>{for(const o of root.querySelectorAll(overlaySel)){if(o.closest('.gf-layer,.gf-sheet,.gf-bar')||!visible(o))continue;const b=Array.from(o.querySelectorAll('button')).find(x=>againRe.test(txt(x))&&visible(x));if(b)return true;}return false;};
 let lastScan=0,raf=0;
 const loop=(now:number)=>{if(disposed)return;raf=requestAnimationFrame(loop);tick();if(now-lastScan<120)return;lastScan=now;
  const node=scoreNode(root);const v=node?toNum(txt(node)):NaN;
  if(Number.isFinite(v)){if(v>score&&started)gain(v-score,node);else if(v>score)markStart();if(v<score&&v===0&&overShown===false)shown=0;score=v;}
  const over=started&&now-startedAt>2500&&finished();
  if(over&&!overShown)showEnd();else if(!over&&overShown&&endCard.hidden){overShown=false;combo=0;startedAt=now;}
  else if(!over&&overShown&&!endCard.hidden&&score===0){hideEnd();overShown=false;}
  pollPad();};
 raf=requestAnimationFrame(loop);
 // Gamepad → keyboard events the games already understand.
 const held=new Set<string>();
 const send=(key:string,down:boolean)=>{if(down===held.has(key))return;if(down)held.add(key);else held.delete(key);const target=document.activeElement&&root.contains(document.activeElement)?document.activeElement:root.querySelector<HTMLElement>('[tabindex],canvas')??window;target.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key,code:key===' '?'Space':key,bubbles:true}));if(down)markStart();};
 let startHeld=false;
 function pollPad(){const pads=navigator.getGamepads?.();const p=pads&&Array.from(pads).find(Boolean);if(!p)return;const ax=p.axes[0]??0,ay=p.axes[1]??0,btn=(i:number)=>!!p.buttons[i]?.pressed;
  send('ArrowLeft',ax<-.5||btn(14));send('ArrowRight',ax>.5||btn(15));send('ArrowUp',ay<-.5||btn(12));send('ArrowDown',ay>.5||btn(13));send(' ',btn(0));
  if(btn(9)&&!startHeld){if(pauseCard.hidden)pause();else resumeBtn.click();}startHeld=btn(9);}
 const onKey=(e:KeyboardEvent)=>{const t=e.target as HTMLElement;if(t.closest('input,textarea,select'))return;if(e.key==='Escape'&&(!sheet.hidden)){closeBtn.click();return;}if(e.key==='p'||e.key==='P'){e.preventDefault();if(pauseCard.hidden)pause();else resumeBtn.click();}if(e.key==='f'||e.key==='F'){if(!fsBtn.hidden)fs();}};
 window.addEventListener('keydown',onKey);
 const onRotate=()=>{if(started&&!overShown)pause();};
 screen.orientation?.addEventListener?.('change',onRotate);
 return ()=>{disposed=true;cancelAnimationFrame(raf);root.removeEventListener('pointerdown',onClick,true);window.removeEventListener('keydown',keyStart);window.removeEventListener('keydown',onKey);document.removeEventListener('fullscreenchange',onFs);screen.orientation?.removeEventListener?.('change',onRotate);for(const el of [bar,layer,sheet,pauseCard,endCard])el.remove();root.classList.remove('gf-on','gf-retro');};
}
