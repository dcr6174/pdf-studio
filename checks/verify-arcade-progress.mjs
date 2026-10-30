import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
// Node runs this check directly, so re-launch with type stripping to load the .ts library.
if(!process.env.ARCADE_PROGRESS_STRIP){
 const r=spawnSync(process.execPath,['--experimental-strip-types','--no-warnings',fileURLToPath(import.meta.url)],{stdio:'inherit',env:{...process.env,ARCADE_PROGRESS_STRIP:'1'}});
 process.exit(r.status??1);
}
import {addFame,cleanInitials,dailySlug,emptyProgress,levelFromXp,missionsFor,nearMiss,parseFame,parseProgress,qualifies,recordRound,roundXp} from '../lib/arcade-progress.ts';
// Levels: 100 XP for level 2, 300 for level 3, 600 for level 4.
assert.equal(levelFromXp(0).level,1);assert.equal(levelFromXp(99).level,1);assert.equal(levelFromXp(100).level,2);assert.equal(levelFromXp(300).level,3);assert.deepEqual(levelFromXp(350),{level:3,into:50,need:300});
// Round XP: 10 to play, capped score bonus, +25 for a new best.
assert.equal(roundXp(0,0),10);assert.equal(roundXp(100,0),75);assert.equal(roundXp(10000,20000),50);
// Daily challenge is the same for everyone on a date and changes between dates.
const slugs=Array.from({length:100},(_,i)=>'game-'+i);
assert.equal(dailySlug('2026-10-30',slugs),dailySlug('2026-10-30',slugs));
assert.ok(new Set(['2026-10-30','2026-10-31','2026-11-01','2026-11-02'].map(d=>dailySlug(d,slugs))).size>1);
// Streak: consecutive days grow, a gap resets to 1, same day keeps it.
let p=emptyProgress();
p=recordRound(p,{slug:'a',score:5,previousBest:0,day:'2026-10-29'},'z').progress;assert.equal(p.streak,1);
p=recordRound(p,{slug:'a',score:5,previousBest:5,day:'2026-10-30'},'z').progress;assert.equal(p.streak,2);
p=recordRound(p,{slug:'a',score:5,previousBest:5,day:'2026-10-30'},'z').progress;assert.equal(p.streak,2);
p=recordRound(p,{slug:'a',score:5,previousBest:5,day:'2026-11-02'},'z').progress;assert.equal(p.streak,1);
// Month rollover counts as consecutive.
let q=recordRound(emptyProgress(),{slug:'a',score:1,previousBest:0,day:'2026-10-31'},'z').progress;q=recordRound(q,{slug:'a',score:1,previousBest:1,day:'2026-11-01'},'z').progress;assert.equal(q.streak,2);
// Missions: 3rd round finishes mission 0; beating best finishes mission 2; each pays once.
assert.equal(p.missions.a.includes(0),true);
const r=recordRound(emptyProgress(),{slug:'b',score:20,previousBest:10,day:'2026-10-30'},'b');
assert.deepEqual(r.missions,['Score 10 in one round','Beat your best score']);assert.equal(r.daily,true);assert.equal(r.xp,roundXp(20,10)+60+20);
assert.deepEqual(recordRound(r.progress,{slug:'b',score:30,previousBest:20,day:'2026-10-30'},'b').missions,[]);
assert.equal(missionsFor(0)[1].target,5);assert.equal(missionsFor(100)[1].target,60);
// Level-up reports unlocks.
const up=recordRound({...emptyProgress(),xp:95},{slug:'c',score:0,previousBest:0,day:'2026-10-30'},'z');assert.equal(up.levelUp,2);assert.deepEqual(up.unlocked,['Sky score trail']);
// Near miss only when just short of the best.
assert.equal(nearMiss(46,50),'So close! 4 short of your best.');assert.equal(nearMiss(10,50),'');assert.equal(nearMiss(60,50),'');assert.equal(nearMiss(5,0),'');
// Hall of fame keeps top 5 with clean 3-letter initials.
let fame=[];for(const s of [10,50,30,20,40,5])if(qualifies(fame,s))fame=addFame(fame,{initials:'ab1',score:s,date:'2026-10-30'});
assert.deepEqual(fame.map(f=>f.score),[50,40,30,20,10]);assert.equal(fame[0].initials,'ABA');assert.equal(qualifies(fame,9),false);assert.equal(qualifies(fame,0),false);
assert.equal(cleanInitials(''),'AAA');assert.deepEqual(parseFame('{bad'),[]);assert.deepEqual(parseFame('[{"initials":"<s>","score":1,"date":"x"}]'),[]);
// Corrupt or hostile storage never breaks the game.
assert.deepEqual(parseProgress('{bad'),emptyProgress());assert.equal(parseProgress('{"xp":-5,"plays":{"../x":3,"ok":2}}').xp,0);assert.deepEqual(parseProgress('{"plays":{"../x":3,"ok":2}}').plays,{ok:2});
console.log('PASS: levels, XP, daily challenge, streaks, missions, unlocks, near miss and hall of fame');
