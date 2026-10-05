import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const mod=text=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const T=await import(mod(await readFile('lib/time-of-day.ts','utf8')));
const R=await import(mod(await readFile('lib/resume.ts','utf8')));
const at=(h,m=0,day=4)=>new Date(2026,9,day,h,m,0,0); // 4 October 2026, device-local time

// parts of the day
for(const [h,m,part] of [[4,59,'night'],[5,0,'morning'],[10,59,'morning'],[11,0,'day'],[16,59,'day'],[17,0,'evening'],[20,59,'evening'],[21,0,'night'],[0,0,'night']])
 assert.equal(T.partOfDay(at(h,m)),part,`${h}:${m} should be ${part}`);
// greeting follows the device time; the example from the brief
assert.equal(T.greetingFor(at(19,38)),'Good evening.');
assert.equal(T.greetingFor(at(9,15)),'Good morning.');
assert.equal(T.greetingFor(at(13,0)),'Good afternoon.');
assert.equal(`${T.greetingFor(at(19,38))} ${T.GREETING_TAIL}`,'Good evening. Let’s make something easier.');
// theme always wins over the hour
for(const part of ['morning','day','evening','night'])assert.equal(T.lightFor('dark',part),'moon',`dark theme wins at ${part}`);
assert.deepEqual(['morning','day','evening','night'].map(p=>T.lightFor('light',p)),['morning','day','evening','evening']);
// clock text: hours, minutes and seconds, weekday and month
const clock=T.formatClock(at(19,38),'en-US');
assert.equal(clock.time,'7:38:00 PM');assert.match(clock.date,/Sunday/);assert.match(clock.date,/October/);assert.ok(/:\d\d:\d\d/.test(clock.time),'seconds visible');
// refresh lands on the next minute boundary
assert.equal(T.msToNextMinute(new Date(2026,9,4,19,38,0,0)),60000);
assert.equal(T.msToNextMinute(new Date(2026,9,4,19,38,59,500)),500);
// seconds are on by default; refresh on a whole-second boundary
assert.equal(T.SHOW_SECONDS,true);
assert.equal(T.msToNextTick(new Date(2026,9,4,19,38,59,500)),500);
assert.equal(T.msToNextTick(new Date(2026,9,4,19,38,10,250),true),750);
assert.equal(T.formatClock(at(19,38),'en-US',true).time,'7:38:00 PM');
assert.ok(!/[٠-٩]/.test(T.formatClock(at(19,38),'ar-EG').time),'latin digits for the rolling reels');
// one steady line per day: same all day, changes with the date, never empty, short
for(const [h,m] of [[0,0],[6,30],[12,0],[23,59]])assert.equal(T.dailyLine(at(h,m)),T.dailyLine(at(0,0)),'stable through the day');
assert.notEqual(T.dailyLine(at(12,0,4)),T.dailyLine(at(12,0,5)),'changes the next day');
assert.equal(new Set(T.dailyLines).size,T.dailyLines.length,'no duplicate lines');
for(const l of T.dailyLines)assert.ok(l.length>10&&l.length<60,'short: '+l);
for(const must of ['Small steps still move you forward.','Your next chapter starts with what you do today.','Progress doesn’t need to be perfect.'])assert.ok(T.dailyLines.includes(must));
// resume is offered only when something can really be recovered
assert.equal(R.recoverableDraft(undefined),null);assert.equal(R.recoverableDraft(null),null);
assert.equal(R.recoverableDraft({files:[],pages:[1]}),null,'no files');
assert.equal(R.recoverableDraft({files:[{name:'a.pdf'}],pages:[]}),null,'no pages');
assert.equal(R.recoverableDraft({pages:[1]}),null,'files missing');
assert.deepEqual(R.recoverableDraft({files:[{name:'a.pdf'},{name:'b.pdf'}],pages:[1,2,3]}),{names:['a.pdf','b.pdf'],pages:3});
// the UI file keeps the rules: greeting/time only after mount, second-aligned timer, resume gated, Download is the primary button
const welcome=await readFile('components/welcome.tsx','utf8'),now=await readFile('components/use-now.ts','utf8'),page=await readFile('app/page.tsx','utf8'),buddy=await readFile('components/buddy-hero.tsx','utf8');
assert.ok(!/setInterval/.test(now),'aligned timeout rather than drifting interval');
assert.ok(now.includes('msToNextTick'));
assert.ok(welcome.includes('{draft&&'),'resume block only renders with a recoverable draft');
assert.ok(page.includes('recoverableDraft(savedDraft)'));
assert.ok(page.includes("view!=='home'||!recoverable"),'old banner is not shown twice on the home page');
assert.ok(page.includes('<ReadyNote'));assert.ok(page.includes('id="download-result" className="primary" onClick={()=>download(output.blob,output.name)}'),'Download remains the primary action');
assert.ok(!/setInterval/.test(buddy),'Buddy does not run a timer loop');
console.log('PASS: parts of the day, greeting, theme-over-time lighting, second-aligned clock with seconds, one steady daily line, resume only for recoverable drafts, no drifting intervals, Download stays primary.');
