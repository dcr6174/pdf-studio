/** Authored and reverse-generated mini-game level packs (no third-party assets). */
export const hangmanPacks=[
 ['TIGER','A wild striped animal'],['MANGO','A sweet tropical fruit'],
 ['RIVER','Fresh water that flows toward the sea'],['CLOUD','A soft-looking shape in the sky'],
 ['OCEAN','A very large body of salt water'],['GUITAR','An instrument with six strings'],
 ['ORCHID','A colourful flowering plant'],['CASTLE','A fortified old building'],
 ['PLANET','A world orbiting a star'],['COMPASS','Used to find north'],
 ['GARDEN','Plants grow here'],['JACKET','A layer for cooler weather'],
 ['LANTERN','A portable light'],['MEADOW','A field of wildflowers'],
 ['PENGUIN','A flightless Antarctic bird'],['ROCKET','Carries spacecraft into the sky'],
 ['SUNRISE','The start of daylight'],['VIOLIN','A bowed string instrument'],
 ['WALNUT','An edible nut with a hard shell'],['RAINBOW','Coloured arc after rain'],
 ['KITCHEN','Where meals are made'],['ISLAND','Land completely surrounded by water'],
 ['LIBRARY','A place to borrow books'],['BICYCLE','A two-wheeled pedal vehicle']
] as const;
export const ladderPacks=[
 ['CAT','COT','COG','DOG'],['COLD','CORD','CARD','WARD','WARM'],
 ['HEAD','HEAL','TEAL','TELL','TALL'],['FIRE','FIRM','FARM','FORM','WORM'],
 ['SAND','SEND','SEED','NEED','NERD'],['SPIN','SPIT','SPOT','SHOT','SHOP'],
 ['BOOK','BOOT','BOAT','GOAT','GOAL'],['MEAN','MEAT','SEAT','SEAM','TEAM'],
 ['LOVE','LIVE','LIFE','LIFT','GIFT'],['GOLD','COLD','CORD','CARD','WARD','WARM'],
 ['HEAT','HEAD','HEAL','TEAL','TELL','TALL'],['BAT','BET','BED','BAD','BAG']
] as const;
const extraWords=['CAR','CAN','CAP','COP','COW','LOG','FOG','BOLD','WORD','COED','HARD','CART','HALL','HILL','FILL','FILE','FILE','FIRM','FARM','HARM','WORE','WORM','FORM','FERN','BED','RED','BAD','BAG','BAT','BET','BAIT','BOOT','BEAT','SEAT','SEAM','TEAM','REAM','ROAD','LOAD','GOAD','GOAT','COAT','BOAT','BOOM','LIFT','GIFT','LIFE','LIVE','GIVE','GOLD','HOLD','COLD','CORD','CORK','CARD','WARD','WARM','WARS','WARN'];
export function oneLetterApart(a:string,b:string){
 if(a.length!==b.length)return false;
 return [...a].filter((c,i)=>c!==b[i]).length===1;
}
export function ladderChoices(words:readonly string[],step:number,seed=0):string[]{
 const current=words[step],correct=words[step+1];
 if(!correct)return[];
 const dictionary=[...new Set([...ladderPacks.flatMap(set=>[...set]),...extraWords])];
 let distractors=dictionary.filter(w=>w!==correct&&w!==current&&oneLetterApart(w,current)&&!words.slice(0,step).includes(w));
 // Prefer valid but non-solution neighbouring words. If too few, use visible non-neighbours for the "one letter" rule.
 if(distractors.length<2)distractors=[...distractors,...dictionary.filter(w=>w!==correct&&w!==current&&!distractors.includes(w)&&w.length===current.length)].slice(0,2);
 const options=[correct,...distractors.slice(0,2)];
 return options.map((_,i)=>options[(i+(step+seed)%3)%3]);
}
export type Tubes=number[][];
export type TubeMove={from:number;to:number};
export function legalTubeMove(tubes:readonly (readonly number[])[],from:number,to:number){
 if(from===to||!tubes[from]||!tubes[to])return false;
 const a=tubes[from],b=tubes[to];
 return a.length>0&&b.length<4&&(b.length===0||b[b.length-1]===a[a.length-1]);
}
export function moveTube(tubes:readonly (readonly number[])[],from:number,to:number):Tubes|null{
 if(!legalTubeMove(tubes,from,to))return null;
 const next=tubes.map(x=>[...x]);next[to].push(next[from].pop()!);return next;
}
export function tubesSolved(tubes:readonly (readonly number[])[]){
 return tubes.every(t=>t.length===0||(t.length===4&&t.every(x=>x===t[0])));
}
function rand(seed:number){let x=seed|0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};}
/** Reverse legal moves from a solved board. Reversing the proof always solves the result. */
export function colorLevel(index=0){
 const random=rand((index+10)*15485863);
 const tubes:Tubes=[[0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[],[]];
 const reverseSteps:TubeMove[]=[];
 for(let step=0;step<Math.min(90,22+Math.max(0,index)*3);step++){
  const moves:TubeMove[]=[];
  for(let from=0;from<6;from++){
   const src=tubes[from];if(!src.length)continue;
   const top=src[src.length-1],next=src[src.length-2];
   if(next!==undefined&&next!==top)continue; // Forward reverse must be legal.
   for(let to=0;to<6;to++){
    if(to===from||tubes[to].length>=4)continue;
    // Prefer mixing to truly challenge players.
    moves.push({from,to});
   }
  }
  if(!moves.length)break;
  const mixed=moves.filter(m=>tubes[m.to].length&&tubes[m.to].at(-1)!==tubes[m.from].at(-1));
  const candidates=mixed.length&&random()>.26?mixed:moves;
  const choice=candidates[Math.floor(random()*candidates.length)];
  tubes[choice.to].push(tubes[choice.from].pop()!);
  reverseSteps.push(choice);
 }
 const proof=reverseSteps.reverse().map(m=>({from:m.to,to:m.from}));
 return{tubes:tubes.map(t=>[...t]),solution:proof};
}
export type ParkingCar={id:'red'|'blue'|'green'|'yellow'|'purple';x:number;y:number;length:number;axis:'h'|'v'};
const parkingBases:ParkingCar[][]=[
 [{id:'red',x:0,y:2,length:2,axis:'h'},{id:'blue',x:2,y:1,length:2,axis:'v'},{id:'green',x:4,y:1,length:2,axis:'v'},{id:'yellow',x:0,y:5,length:3,axis:'h'},{id:'purple',x:5,y:3,length:2,axis:'v'}],
 [{id:'red',x:0,y:2,length:2,axis:'h'},{id:'blue',x:2,y:0,length:3,axis:'v'},{id:'green',x:3,y:1,length:2,axis:'v'},{id:'yellow',x:0,y:5,length:3,axis:'h'},{id:'purple',x:5,y:3,length:2,axis:'v'}],
 [{id:'red',x:1,y:2,length:2,axis:'h'},{id:'blue',x:3,y:1,length:2,axis:'v'},{id:'green',x:4,y:1,length:2,axis:'v'},{id:'yellow',x:0,y:5,length:3,axis:'h'},{id:'purple',x:5,y:3,length:2,axis:'v'}],
 [{id:'red',x:0,y:2,length:2,axis:'h'},{id:'blue',x:3,y:1,length:2,axis:'v'},{id:'green',x:4,y:0,length:3,axis:'v'},{id:'yellow',x:0,y:4,length:3,axis:'h'},{id:'purple',x:5,y:3,length:2,axis:'v'}],
 [{id:'red',x:0,y:2,length:2,axis:'h'},{id:'blue',x:2,y:1,length:3,axis:'v'},{id:'green',x:3,y:1,length:2,axis:'v'},{id:'yellow',x:0,y:5,length:3,axis:'h'},{id:'purple',x:5,y:3,length:2,axis:'v'}]
];
export function parkingLevel(index=0):ParkingCar[]{return parkingBases[((index%parkingBases.length)+parkingBases.length)%parkingBases.length].map(c=>({...c}));}
const spaces=(car:ParkingCar,x=car.x,y=car.y)=>Array.from({length:car.length},(_,i)=>car.axis==='h'?(x+i)+y*6:x+(y+i)*6);
export function slideParking(cars:readonly ParkingCar[],index:number,delta:number):ParkingCar[]|null{
 const car=cars[index];if(!car||!Number.isInteger(delta)||Math.abs(delta)!==1)return null;
 const x=car.x+(car.axis==='h'?delta:0),y=car.y+(car.axis==='v'?delta:0);
 if(x<0||y<0||x+(car.axis==='h'?car.length:1)>6||y+(car.axis==='v'?car.length:1)>6)return null;
 const occupied=new Set(cars.filter((_,i)=>i!==index).flatMap(c=>spaces(c)));
 if(spaces(car,x,y).some(s=>occupied.has(s)))return null;
 return cars.map((c,i)=>i===index?{...c,x,y}:c);
}
export function parkingSolved(cars:readonly ParkingCar[]){
 const red=cars.find(c=>c.id==='red');return !!red&&red.x+red.length===6;
}
export function parkingHint(cars:readonly ParkingCar[],limit=30000):{index:number;delta:number}|null{
 const key=(v:readonly ParkingCar[])=>v.map(c=>c.x+','+c.y).join(';');
 const q=[{board:cars.map(c=>({...c})),first:null as {index:number;delta:number}|null}],seen=new Set([key(cars)]);
 for(let i=0;i<q.length&&i<limit;i++){
  const node=q[i];if(parkingSolved(node.board))return node.first;
  for(let car=0;car<node.board.length;car++)for(const delta of [-1,1]){
   const next=slideParking(node.board,car,delta);if(!next)continue;
   const k=key(next);if(seen.has(k))continue;seen.add(k);
   q.push({board:next,first:node.first??{index:car,delta}});
  }
 }
 return null;
}
