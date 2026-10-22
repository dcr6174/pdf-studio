/** Deterministic, browser-independent puzzle mechanics used by Play Studio. */
export type Tile={x:number;y:number};
export const fallingShapes:readonly (readonly (readonly [number,number])[])[]=[
 [[0,0],[1,0],[0,1],[1,1]],[[0,0],[0,1],[0,2],[0,3]],[[0,0],[0,1],[1,1],[1,2]],[[0,0],[1,0],[2,0],[1,1]]
];
export const fallingColours=['#c7b2f4','#9fe2d2','#ffd39a','#f4b5c7'];
export function rotatedCells(shape:number,turns:number):Tile[]{
 const src=fallingShapes[((shape%fallingShapes.length)+fallingShapes.length)%fallingShapes.length];
 const spun=src.map(([x,y])=>{let a=x,b=y;for(let t=0;t<((turns%4)+4)%4;t++){[a,b]=[-b,a];}return{x:a,y:b};});
 const minX=Math.min(...spun.map(p=>p.x)),minY=Math.min(...spun.map(p=>p.y));
 return spun.map(p=>({x:p.x-minX,y:p.y-minY}));
}
export function droppedCells(board:readonly Tile[],shape:number,rotation:number,column:number,width=7,height=9):Tile[]|null{
 const offsets=rotatedCells(shape,rotation).map(c=>({x:c.x+column,y:c.y}));
 const occupied=new Set(board.map(b=>b.x+','+b.y));
 const fits=(row:number)=>offsets.every(c=>c.x>=0&&c.x<width&&row+c.y<height&&!occupied.has(c.x+','+(row+c.y)));
 if(!fits(0))return null;
 let row=0;
 while(fits(row+1))row++;
 return offsets.map(c=>({x:c.x,y:c.y+row}));
}
export function settleRows(cells:readonly Tile[],width=7,height=9){
 const clears:number[]=[];
 for(let row=0;row<height;row++)if(Array.from({length:width},(_,x)=>x).every(x=>cells.some(t=>t.x===x&&t.y===row)))clears.push(row);
 const compacted=cells.filter(c=>!clears.includes(c.y)).map(c=>({x:c.x,y:c.y+clears.filter(row=>row>c.y).length}));
 return {tiles:compacted,cleared:clears.length};
}
/** Different target moments and partial choices; user must balance the right side. */
export const balanceChallenges=[
 {weight:2,distance:2,goal:4},
 {weight:3,distance:2,goal:6},
 {weight:2,distance:3,goal:6},
 {weight:4,distance:2,goal:8}
] as const;
export const countingSymbols=['🍒','🌼','🌙','🍋'] as const;
export function countingBoard(level:number,seed=0){
 const icons=Array.from({length:12},(_,i)=>countingSymbols[(i*i+3*i+level*5+seed+i*level)%countingSymbols.length]);
 // A different target and arrangement on every round, no fixed repeated 12-icon grid.
 const target=countingSymbols[(level*7+seed)%countingSymbols.length];
 const count=icons.filter(x=>x===target).length;
 return {icons,target,count};
}
export function arithmeticPrompt(level:number,seed=0){
 const index=Math.max(0,Math.floor(level))+Math.max(0,Math.floor(seed))*11;
 const a=2+index*7%13,b=1+(index*5+3)%9,mode=index%3;
 return mode===0?{a,b,op:'+',answer:a+b}:mode===1?{a:a+b,b,op:'−',answer:a}:{a:2+index%8,b:2+(index*3)%7,op:'×',answer:(2+index%8)*(2+(index*3)%7)};
}
