import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const url=s=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64');
const catalogURL=url(fs.readFileSync('lib/puzzle-catalog.ts','utf8')),dataURL=url(fs.readFileSync('lib/puzzle-data.ts','utf8'));
const {puzzleGames}=await import(catalogURL);
const {createPuzzle,puzzleReducer:act,tileFree,hexFree,selectPicturePiece,restorePuzzleProgress,countSudokuSolutions,queenConflicts}=await import(url(fs.readFileSync('lib/puzzle-engine.ts','utf8').replaceAll("'./puzzle-data'",JSON.stringify(dataURL)).replaceAll("'./puzzle-catalog'",JSON.stringify(catalogURL))));
assert.equal(puzzleGames.length,27);assert.equal(new Set(puzzleGames.map(g=>g.slug)).size,27);
for(const game of puzzleGames){
 let s=createPuzzle(game.slug,0,17);assert.deepEqual(s,createPuzzle(game.slug,0,17),'seeded round '+game.slug);
 const original=structuredClone(s);const put=i=>s=act(s,{type:'cell',index:i});
 if(s.family==='letters'||s.family==='duel'){for(const w of [...s.words].sort((a,b)=>a.length-b.length)){if(s.status!=='playing')break;if(s.found.includes(w))continue;const used=[];for(const c of w){const i=[...s.letters].findIndex((v,i)=>v===c&&!used.includes(i));assert(i>=0);used.push(i);put(i);}s=act(s,{type:'submit'});}assert.notEqual(s.status,'playing',game.slug);}
 if(s.family==='crossword'){assert(s.entries.length>=2,'real crossings: '+game.slug);for(let i=0;i<s.answer.length;i++)if(s.answer[i]&&s.status==='playing'){put(i);s=act(s,{type:'letter',value:String.fromCharCode(s.answer[i])});}assert.equal(s.status,'won',game.slug);}
 if(s.family==='search'){assert(s.words.length>=3);for(const e of s.entries){assert.equal(e.cells.map(i=>String.fromCharCode(s.board[i])).join(''),e.word);put(e.cells[0]);put(e.cells.at(-1));}assert.equal(s.status,'won',game.slug);}
 if(s.family==='path'){for(const word of original.words){const row=original.words.indexOf(word);for(let i=0;i<3;i++)put(row*3+i);s=act(s,{type:'submit'});}assert.equal(s.status,'won');}
 if(s.family==='cards'){while(s.words.length){const w=s.words[0],used=[];for(const c of w){const i=s.columns.findIndex((col,i)=>!used.includes(i)&&col.at(-1)===c.charCodeAt(0));assert(i>=0);used.push(i);put(i);}s=act(s,{type:'submit'});}assert.equal(s.status,'won');}
 if(s.family==='groups'){if(s.variant==='solitaire'){while(s.stock.length)s=act(s,{type:'draw'});let guard=0;while(s.status==='playing'&&guard++<32){const col=s.columns.findIndex(c=>c.length);assert(col>=0);const w=s.words[s.columns[col].at(-1)],group=s.groups.findIndex(g=>g.words.includes(w));put(col);s=act(s,{type:'foundation',index:group});}}else for(const g of s.groups){for(const w of g.words)put(s.words.indexOf(w));s=act(s,{type:'submit'});}assert.equal(s.status,'won',game.slug);}
 if(s.family==='cipher'){for(let i=0;i<s.quote.length&&s.status==='playing';i++){if(s.quote[i]===' ')continue;put(i);s=act(s,{type:'letter',value:s.quote[i]});}assert.equal(s.status,'won');}
 if(s.family==='sudoku'){assert.equal(countSudokuSolutions([...s.board]),1,'unique Sudoku solution');for(let i=0;i<81;i++)if(!s.fixed.includes(i)){put(i);s=act(s,{type:'digit',value:s.answer[i]});}assert.equal(s.status,'won');}
 if(s.family==='tiles'){let guard=0;while(s.status==='playing'&&guard++<64){const a=s.board.findIndex((v,i)=>v&&(s.variant==='triple'||tileFree(s,i)));assert(a>=0);const ids=s.board.map((v,i)=>v===s.board[a]&&(s.variant==='triple'||tileFree(s,i))?i:-1).filter(i=>i>=0).slice(0,s.variant==='triple'?3:2);assert.equal(ids.length,s.variant==='triple'?3:2);for(const i of ids)put(i);}assert.equal(s.status,'won',game.slug);}
 if(s.family==='hex'){let guard=0;while(s.status==='playing'&&guard++<30){const i=s.board.findIndex((v,i)=>v&&hexFree(s,i));assert(i>=0,'solvable arrows');put(i);}assert.equal(s.status,'won');}
 if(s.family==='queens'){for(const i of s.answer)put(i);assert.deepEqual(queenConflicts(s),[]);assert.equal(s.status,'won');}
 if(s.family==='picture'){if(s.variant==='jigsaw'){for(let i=0;i<s.board.length;i++){s=selectPicturePiece(s,i+1);put(i);}}else{for(let i=0;i<s.board.length;i++)if(s.board[i]!==i+1){const at=s.board.indexOf(i+1);put(i);put(at);}}assert.equal(s.status,'won');}
 if(s.family==='chain'){s.board[0]=s.board[1]=128;put(0);put(1);s=act(s,{type:'submit'});assert.equal(s.status,'won');}
 if(s.family==='blocks'){s.shapes=[[[0,0]],[[0,0]],[[0,0]]];s.usedShapes=[];for(let n=0;n<8;n++){s.shapes=[[[0,0]],[[0,0]],[[0,0]]];s.usedShapes=[];s=act(s,{type:'shape',index:0});put(n);}assert(s.board.slice(0,8).every(v=>!v),'full row clears');assert(s.score>=48);}
 assert.deepEqual(original,createPuzzle(game.slug,0,17),'reducer never mutates initial state');
}
// Wrong inputs, losing tray, undo, duplicate targets and malformed persistence.
let s=createPuzzle('triple-tile-tea');s.board=[1,2,3,4,5,6,7];for(let i=0;i<7;i++)s=act(s,{type:'cell',index:i});assert.equal(s.status,'lost');s=act(s,{type:'undo'});assert.equal(s.status,'playing');assert.equal(s.tray.length,6);
s=createPuzzle('crossword-sprint');s={...s,seconds:119};s=act(s,{type:'tick',seconds:1});assert.equal(s.status,'lost');
assert.equal(restorePuzzleProgress({version:1,slug:'x',level:-1,best:0},'x'),null);assert.equal(restorePuzzleProgress({version:1,slug:'x',level:1,best:NaN},'x'),null);assert.deepEqual(restorePuzzleProgress({version:1,slug:'x',level:2,best:10},'x'),{level:2,best:10});
for(let seed=0;seed<20;seed++){for(const slug of ['hex-escape','paw-parks']){let p=createPuzzle(slug,seed%5,seed);if(p.family==='hex'){let guard=0;while(p.status==='playing'&&guard++<30){const i=p.board.findIndex((v,i)=>v&&hexFree(p,i));assert(i>=0);p=act(p,{type:'cell',index:i});}assert.equal(p.status,'won');}else{p.selected=[...p.answer];assert.equal(queenConflicts(p).length,0);}}}
console.log('PASS: 27 seeded games; complete rounds across the puzzle families; Sudoku uniqueness; word targets; arrow and puppy solvability; line clearing; tray loss/undo; timer loss; invalid save rejection. Pure-engine checks, not phone/browser playtests.');
