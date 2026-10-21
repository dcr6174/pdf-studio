import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const url=s=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64');
const catalogURL=url(fs.readFileSync('lib/puzzle-catalog.ts','utf8')),dataURL=url(fs.readFileSync('lib/puzzle-data.ts','utf8'));
const {puzzleGames}=await import(catalogURL);
const {createPuzzle,puzzleReducer:act,tileFree,hexFree,selectPicturePiece,restorePuzzleProgress,restorePuzzleSession,puzzleGoal,roundStars,countSudokuSolutions,queenConflicts}=await import(url(fs.readFileSync('lib/puzzle-engine.ts','utf8').replaceAll("'./puzzle-data'",JSON.stringify(dataURL)).replaceAll("'./puzzle-catalog'",JSON.stringify(catalogURL))));
assert.equal(puzzleGames.length,27);assert.equal(new Set(puzzleGames.map(g=>g.slug)).size,27);
for(const game of puzzleGames){
 let s=createPuzzle(game.slug,0,17);assert.deepEqual(s,createPuzzle(game.slug,0,17),'seeded round '+game.slug);
 const original=structuredClone(s);const put=i=>s=act(s,{type:'cell',index:i});
 if(s.family==='letters'||s.family==='duel'){for(const w of [...s.words].sort((a,b)=>a.length-b.length)){if(s.status!=='playing')break;if(s.found.includes(w))continue;const used=[];for(const c of w){const i=[...s.letters].findIndex((v,i)=>v===c&&!used.includes(i));assert(i>=0);used.push(i);put(i);}s=act(s,{type:'submit'});}assert.notEqual(s.status,'playing',game.slug);}
 if(s.family==='crossword'){assert(s.entries.length>=2,'real crossings: '+game.slug);for(let i=0;i<s.answer.length;i++)if(s.answer[i]&&s.status==='playing'){put(i);s=act(s,{type:'letter',value:String.fromCharCode(s.answer[i])});}assert.equal(s.status,'won',game.slug);}
 if(s.family==='search'){assert(s.words.length>=3);for(const e of s.entries){assert.equal(e.cells.map(i=>String.fromCharCode(s.board[i])).join(''),e.word);put(e.cells[0]);put(e.cells.at(-1));}assert.equal(s.status,'won',game.slug);}
 if(s.family==='path'){for(const entry of original.entries){for(const i of entry.cells)put(i);s=act(s,{type:'submit'});}assert.equal(s.status,'won');}
 if(s.family==='cards'){while(s.words.length){const w=s.words[0],used=[];for(const c of w){const i=s.columns.findIndex((col,i)=>!used.includes(i)&&col.at(-1)===c.charCodeAt(0));assert(i>=0);used.push(i);put(i);}s=act(s,{type:'submit'});}assert.equal(s.status,'won');}
 if(s.family==='groups'){if(s.variant==='solitaire'){while(s.stock.length)s=act(s,{type:'draw'});let guard=0;while(s.status==='playing'&&guard++<32){const col=s.columns.findIndex(c=>c.length);assert(col>=0);const w=s.words[s.columns[col].at(-1)],group=s.groups.findIndex(g=>g.words.includes(w));put(col);s=act(s,{type:'foundation',index:group});}}else for(const g of s.groups){for(const w of g.words)put(s.words.indexOf(w));s=act(s,{type:'submit'});}assert.equal(s.status,'won',game.slug);}
 if(s.family==='cipher'){for(let i=0;i<s.quote.length&&s.status==='playing';i++){if(s.quote[i]===' ')continue;put(i);s=act(s,{type:'letter',value:s.quote[i]});}assert.equal(s.status,'won');}
 if(s.family==='sudoku'){assert.equal(countSudokuSolutions([...s.board]),1,'unique Sudoku solution');for(let i=0;i<81;i++)if(!s.fixed.includes(i)){put(i);s=act(s,{type:'digit',value:s.answer[i]});}assert.equal(s.status,'won');}
 if(s.family==='tiles'){let guard=0;while(s.status==='playing'&&guard++<120){const a=s.board.findIndex((v,i)=>v&&tileFree(s,i)&&(s.variant!=='triple'||s.board.filter((w,j)=>w===v&&tileFree(s,j)).length>=3));assert(a>=0);const ids=s.board.map((v,i)=>v===s.board[a]&&tileFree(s,i)?i:-1).filter(i=>i>=0).slice(0,s.variant==='triple'?3:2);assert.equal(ids.length,s.variant==='triple'?3:2);for(const i of ids)put(i);}assert.equal(s.status,'won',game.slug);}
 if(s.family==='hex'){let guard=0;while(s.status==='playing'&&guard++<100){const i=s.board.findIndex((v,i)=>v&&hexFree(s,i));assert(i>=0,'solvable arrows');put(i);}assert.equal(s.status,'won');}
 if(s.family==='queens'){for(const i of s.answer)put(i);assert.deepEqual(queenConflicts(s),[]);assert.equal(s.status,'won');}
 if(s.family==='picture'){if(s.variant==='jigsaw'){for(let i=0;i<s.board.length;i++){s=selectPicturePiece(s,i+1);put(i);}}else{for(let i=0;i<s.board.length;i++)if(s.board[i]!==i+1){const at=s.board.indexOf(i+1);put(i);put(at);}}assert.equal(s.status,'won');}
 if(s.family==='chain'){s.board[0]=s.board[1]=128;put(0);put(1);s=act(s,{type:'submit'});assert.equal(s.status,'won');}
 if(s.family==='blocks'){s.shapes=[[[0,0]],[[0,0]],[[0,0]]];s.usedShapes=[];for(let n=0;n<8;n++){s.shapes=[[[0,0]],[[0,0]],[[0,0]]];s.usedShapes=[];s=act(s,{type:'shape',index:0});put(n);}assert(s.board.slice(0,8).every(v=>!v),'full row clears');assert(s.score>=48);}
 assert.deepEqual(original,createPuzzle(game.slug,0,17),'reducer never mutates initial state');
}
// Wrong inputs, losing tray, undo, duplicate targets and malformed persistence.
let s=createPuzzle('triple-tile-tea');s.board=[1,2,3,4,5,6,7];s.size=7;for(let i=0;i<7;i++)s=act(s,{type:'cell',index:i});assert.equal(s.status,'lost');s=act(s,{type:'undo'});assert.equal(s.status,'playing');assert.equal(s.tray.length,6);
s=createPuzzle('crossword-sprint');s={...s,seconds:119};s=act(s,{type:'tick',seconds:1});assert.equal(s.status,'lost');
assert.equal(restorePuzzleProgress({version:1,slug:'x',level:-1,best:0},'x'),null);assert.equal(restorePuzzleProgress({version:1,slug:'x',level:1,best:NaN},'x'),null);assert.deepEqual(restorePuzzleProgress({version:1,slug:'x',level:2,best:10},'x'),{level:2,best:10});
for(let seed=0;seed<20;seed++){for(const slug of ['hex-escape','paw-parks']){let p=createPuzzle(slug,seed%5,seed);if(p.family==='hex'){let guard=0;while(p.status==='playing'&&guard++<100){const i=p.board.findIndex((v,i)=>v&&hexFree(p,i));assert(i>=0);p=act(p,{type:'cell',index:i});}assert.equal(p.status,'won');}else{p.selected=[...p.answer];assert.equal(queenConflicts(p).length,0);}}}
console.log('PASS: 27 seeded games; complete rounds across the puzzle families; Sudoku uniqueness; word targets; arrow and puppy solvability; line clearing; tray loss/undo; timer loss; invalid save rejection. Pure-engine checks, not phone/browser playtests.');
// Solve the unmodified opening block round using only legal placement actions.
{
 let p=createPuzzle('block-bloom');
 for(let move=0;move<80&&p.status==='playing';move++){
  let chosen=null,best=-Infinity;
  for(let k=0;k<3;k++){if(p.usedShapes.includes(k))continue;
   for(let i=0;i<64;i++){
    const shape=p.shapes[k],x=i%8,y=Math.floor(i/8);
    if(shape.some(([dx,dy])=>x+dx>=8||y+dy>=8||p.board[(y+dy)*8+x+dx]))continue;
    const next=act(act({...p,history:[]},{type:'shape',index:k}),{type:'cell',index:i});
    let value=(next.score-p.score)*100;
    for(let n=0;n<8;n++){let row=0,col=0;for(let j=0;j<8;j++){row+=!!next.board[n*8+j];col+=!!next.board[j*8+n];}value+=row*row+col*col;}
    value-=next.board.reduce((v,n,i)=>v+(n?Math.floor(i/8)*.2+i%8*.1:0),0);
    if(value>best){best=value;chosen=next;}
   }
  }
  assert(chosen,'a legal block placement remains');p=chosen;
 }
 assert.equal(p.status,'won','unmodified seeded block round completes');
}
console.log('PASS: complete seeded Block Bloom round through legal shape selections/placements.');

// Campaign variety and exact, validated mid-round recovery, including Undo and picture choices.
for(const slug of ['letter-trails','word-path','letter-solitaire','word-safari','crossword-atlas','word-families','secret-quote','buddy-jigsaw','paw-parks','hex-escape','triple-tile-tea','mahjong-meadow','sudoku-studio','number-river']){
 const a=createPuzzle(slug,0,17),b=createPuzzle(slug,12,17);assert.notDeepEqual(a.family==='groups'?a.words:a.board.length?a.board:a.words,b.family==='groups'?b.words:b.board.length?b.board:b.words,slug+' develops beyond opening round');
}
for(const game of puzzleGames){let p=createPuzzle(game.slug,4,17);for(const a of [{type:'cell',index:0},{type:'hint'},{type:'undo'},{type:'tick',seconds:2}])p=act(p,a);const saved={version:2,slug:game.slug,level:p.level,seed:p.seed,best:100,stars:{0:3},actions:p.journal};const loaded=restorePuzzleSession(JSON.parse(JSON.stringify(saved)),game.slug);assert(loaded);assert.deepEqual(loaded.state,p,game.slug+' restores exact board and history');assert.deepEqual(loaded.stars,{'0':3});assert.equal(restorePuzzleSession({...saved,actions:[{type:'replace',state:{}}]},game.slug),null);assert.equal(restorePuzzleSession({...saved,actions:[{type:'cell',index:999999}]},game.slug),null);}
for(let level=0;level<=20;level+=4){for(const slug of ['word-path','letter-solitaire']){let p=createPuzzle(slug,level,31);const original=structuredClone(p);if(p.family==='path')for(const e of original.entries){for(const index of e.cells)p=act(p,{type:'cell',index});p=act(p,{type:'submit'});}else while(p.words.length){const used=[];for(const c of p.words[0]){const index=p.columns.findIndex((col,i)=>!used.includes(i)&&col.at(-1)===c.charCodeAt(0));assert(index>=0);used.push(index);p=act(p,{type:'cell',index});}p=act(p,{type:'submit'});}assert.equal(p.status,'won');}}
assert(puzzleGoal(createPuzzle('block-bloom',12)).target>puzzleGoal(createPuzzle('block-bloom')).target);assert(puzzleGoal(createPuzzle('number-river',12)).target>256);assert.equal(roundStars({...createPuzzle('word-path'),status:'won',hints:0,mistakes:0}),3);
console.log('PASS: campaign progression, generated longer paths/card stacks, all 27 mid-round saves with Undo, malformed journal rejection and earned stars.');

// Covered triple tiles reject input, and generated stacks have an exposed solution at every step.
for(let seed=0;seed<24;seed++){let p=createPuzzle('triple-tile-tea',seed,seed+5);const covered=p.board.findIndex((v,i)=>v&&!tileFree(p,i));assert(covered>=0);assert.equal(act(p,{type:'cell',index:covered}).moves,0);while(p.status==='playing'){const group=p.board.findIndex((v,i)=>v&&tileFree(p,i)&&p.board.filter((w,j)=>w===v&&tileFree(p,j)).length>=3);assert(group>=0,'constructed stacks remain solvable');const value=p.board[group],ids=p.board.map((v,i)=>v===value&&tileFree(p,i)?i:-1).filter(i=>i>=0).slice(0,3);for(const index of ids)p=act(p,{type:'cell',index});}assert.equal(p.status,'won');}
console.log('PASS: covered tile protection and complete exposed-triple solutions across 24 campaign seeds.');

{let calm=createPuzzle('quiet-words');calm.score=50;const hinted=act(calm,{type:'hint'});assert.equal(hinted.score,50);assert.equal(hinted.hints,0);let orbit=createPuzzle('orbit-words');const full=orbit.words.find(w=>w.length===orbit.letters.length);if(full){for(const char of full){const index=[...orbit.letters].findIndex((c,i)=>c===char&&!orbit.selected.includes(i));orbit=act(orbit,{type:'cell',index});}orbit=act(orbit,{type:'submit'});assert(orbit.found.includes(full),'long orbit word accepted immediately');}let path=createPuzzle('word-path');path.selected=[0,1,2];path=act(path,{type:'cell',index:1});assert.deepEqual(path.selected,[0,1],'backtrack retains touched letter');}
console.log('PASS: calm hints preserve score/stars, Orbit banks long words, path backtracking retains its endpoint.');
