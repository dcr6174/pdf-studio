import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
// Static imports resolve before this bootstrap; keep TypeScript imports dynamic and restart with stripping when needed.
if(!process.execArgv.includes('--experimental-strip-types')){
 const r=spawnSync(process.execPath,['--experimental-strip-types','--no-warnings',fileURLToPath(import.meta.url)],{stdio:'inherit'});
 process.exit(r.status??1);
}
const {arcadeProfile,beats,isArcadeReport}=await import('../lib/arcade-session.ts');
const {parseMix,gainFor,pitchSpread,defaultMix}=await import('../lib/arcade-mixer.ts');
// Scoring style follows the mechanic: golf counts strokes, versus boards are won or lost, everything else scores points.
assert.equal(arcadeProfile('golf').scoreKind,'strokes');
for(const k of ['chess','checkers','connect','reversi','dots','fleet','mancala','ludo','snakes','domino','tictactoe'])assert.equal(arcadeProfile(k).scoreKind,'outcome',k);
for(const k of ['runner','merge','sudoku','cricket','basketball'])assert.equal(arcadeProfile(k).scoreKind,'points',k);
// Only fast physical games get shake/combo feedback; boards, puzzles and relax games stay calm.
for(const k of ['runner','breaker','cricket','basketball','hockey','highway'])assert.equal(arcadeProfile(k).feel,'action',k);
for(const k of ['chess','sudoku','merge','memory','sand','crossword'])assert.equal(arcadeProfile(k).feel,'calm',k);
// Games that type letters keep the keyboard; the frame's P/F shortcuts step aside.
assert.equal(arcadeProfile('crossword').letterKeys,true);assert.equal(arcadeProfile('runner').letterKeys,false);
// Records: more points is better, fewer strokes is better, win/lose games have no score record.
assert.equal(beats('points',12,10),true);assert.equal(beats('points',10,10),false);assert.equal(beats('points',0,0),false);
assert.equal(beats('strokes',30,34),true);assert.equal(beats('strokes',36,34),false);assert.equal(beats('strokes',30,0),true);assert.equal(beats('strokes',0,0),false);
assert.equal(beats('outcome',99,0),false);
// Only well-formed reports reach the frame.
const ok={slug:'buddy-runner',phase:'playing',score:3,best:9,won:null,message:'',scoreKind:'points',feel:'action',letterKeys:false,canPause:true,sound:true};
assert.equal(isArcadeReport(ok),true);assert.equal(isArcadeReport({...ok,againLabel:'Next puzzle →'}),true);
for(const bad of [{...ok,phase:'won'},{...ok,score:NaN},{...ok,won:'yes'},{...ok,scoreKind:'time'},{...ok,sound:'on'},{...ok,againLabel:5},null,'x'])assert.equal(isArcadeReport(bad),false);
// Volume mix: defaults, clamping and hostile storage.
assert.deepEqual(parseMix(null),defaultMix);assert.deepEqual(parseMix('{bad'),defaultMix);
assert.deepEqual(parseMix('{"master":2,"sfx":-1,"ui":0.5,"ambience":"loud"}'),{master:1,sfx:0,ui:.5,ambience:defaultMix.ambience});
assert.equal(gainFor(0),0);assert.equal(gainFor(1),1);assert.equal(gainFor(.5),.25);
// Pitch spread stays within ±3.5% and varies between plays.
const spreads=Array.from({length:50},(_,i)=>pitchSpread(i+1));
assert.ok(spreads.every(p=>p>=.965&&p<=1.035));assert.ok(new Set(spreads.map(p=>p.toFixed(4))).size>40);
console.log('PASS: arcade round protocol, scoring styles, feedback styles, keyboard ownership and sound mix');
