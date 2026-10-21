/** Local, cosmetic-only Arcade progression. Never imports a document engine. */
export const GARDEN_VERSION=1;
export const gardenThemes=['lavender','meadow','sunset'] as const;
export type GardenTheme=typeof gardenThemes[number];
export const gardenItems=[
 {id:'bow',name:'Lavender bow',icon:'🎀',cost:30,rare:false},
 {id:'leaf',name:'Leaf crown',icon:'🌿',cost:35,rare:false},
 {id:'sunhat',name:'Sun hat',icon:'👒',cost:40,rare:false},
 {id:'butterfly',name:'Paper butterfly',icon:'🦋',cost:45,rare:false},
 {id:'flower',name:'Daisy crown',icon:'🌼',cost:45,rare:false},
 {id:'scarf',name:'Cosy scarf',icon:'🧣',cost:50,rare:false},
 {id:'kite',name:'Pocket kite',icon:'🪁',cost:60,rare:false},
 {id:'fox',name:'Origami fox',icon:'🦊',cost:90,rare:true},
 {id:'dragon',name:'Paper dragon',icon:'🐉',cost:100,rare:true},
 {id:'moon',name:'Moon lantern',icon:'🌙',cost:100,rare:true},
 {id:'rainbow',name:'Rainbow arch',icon:'🌈',cost:110,rare:true},
 {id:'castle',name:'Paper castle',icon:'🏰',cost:120,rare:true},
 {id:'comet',name:'Comet companion',icon:'☄️',cost:120,rare:true},
 {id:'trophy',name:'Garden trophy',icon:'🏆',cost:150,rare:true},
] as const;
export type GardenReward={day:string;visit:number;xp:number;stars:number;bonus:string;item:string|null;milestone:number;multiplier:number};
export type GardenState={version:1;visits:number;xp:number;stars:number;lastDay:string|null;dryClaims:number;owned:string[];equipped:string|null;theme:GardenTheme;choices:number;lastReward:GardenReward|null;sound:boolean};
export const newGarden=():GardenState=>({version:1,visits:0,xp:0,stars:0,lastDay:null,dryClaims:0,owned:[],equipped:null,theme:'lavender',choices:0,lastReward:null,sound:false});
export function gardenDay(now:number){if(!Number.isFinite(now))throw Error('Invalid date');return new Date(now).toISOString().slice(0,10);}
export function gardenVisit(total:number){return total%30+1;}
export function gardenMultiplier(visit:number){if(visit<=7)return[1,1.1,1.25,1.35,1.5,1.75,2][visit-1];if(visit===14)return 2;if(visit===21)return 2.25;if(visit===28)return 2.5;if(visit===30)return 3;return visit<14?1.25:visit<21?1.5:visit<28?1.75:1.75;}
export const gardenMilestones:Record<number,{stars:number;choices:number;label:string}>={3:{stars:0,choices:1,label:'Choose an accessory'},7:{stars:50,choices:1,label:'Rare creation + 50 Stars'},14:{stars:75,choices:1,label:'Outfit + 75 Stars'},21:{stars:100,choices:1,label:'Companion + 100 Stars'},28:{stars:125,choices:1,label:'Landmark + 125 Stars'},30:{stars:200,choices:1,label:'Trophy + 200 Stars'}};
const integer=(v:unknown,max=100000000)=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0&&v<=max;
const knownItem=(v:unknown)=>typeof v==='string'&&gardenItems.some(i=>i.id===v);
const dayKey=(v:unknown)=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export function restoreGarden(raw:unknown):GardenState|null{
 if(!raw||typeof raw!=='object')return null;const s=raw as GardenState;
 if(s.version!==1||!integer(s.visits,1000000)||!integer(s.xp)||!integer(s.stars)||!integer(s.dryClaims,9)||!integer(s.choices,1000000)||!Array.isArray(s.owned)||s.owned.length>gardenItems.length||new Set(s.owned).size!==s.owned.length||!s.owned.every(knownItem)||!gardenThemes.includes(s.theme)||typeof s.sound!=='boolean'||s.equipped!==null&&(!knownItem(s.equipped)||!s.owned.includes(s.equipped))||s.lastDay!==null&&!dayKey(s.lastDay))return null;
 if(s.lastReward!==null){const r=s.lastReward;if(typeof r!=='object'||!dayKey(r.day)||r.day!==s.lastDay||!integer(r.visit,30)||r.visit<1||!integer(r.xp,1000)||!integer(r.stars,1000)||!integer(r.milestone,30)||typeof r.multiplier!=='number'||![1,1.1,1.25,1.35,1.5,1.75,2,2.25,2.5,3].includes(r.multiplier)||typeof r.bonus!=='string'||r.bonus.length>150||r.item!==null&&!knownItem(r.item))return null;}
 if((s.visits===0)!==(s.lastDay===null)||s.visits>0&&s.lastReward===null)return null;
 return structuredClone(s);
}
export function claimGarden(state:GardenState,day:string,luck:number,itemLuck:number):{state:GardenState;claimed:boolean}{
 if(!dayKey(day)||!Number.isFinite(luck)||luck<0||luck>=1||!Number.isFinite(itemLuck)||itemLuck<0||itemLuck>=1)throw Error('Invalid claim');
 if(state.lastDay&&day<=state.lastDay)return{state,claimed:false};
 const s=structuredClone(state),visit=gardenVisit(s.visits),multiplier=gardenMultiplier(visit),milestone=gardenMilestones[visit];let stars=Math.round(10*multiplier)+(milestone?.stars??0),item:string|null=null,bonus='';
 const cosmetic=s.dryClaims>=9||luck>=.85;
 if(cosmetic){const rare=luck>=.97,pool=gardenItems.filter(i=>i.rare===rare),chosen=pool[Math.floor(itemLuck*pool.length)];s.dryClaims=0;if(s.owned.includes(chosen.id)){stars+=15;bonus='Duplicate '+chosen.name+' → 15 Stars';}else{item=chosen.id;s.owned.push(chosen.id);bonus=chosen.name;}}
 else{s.dryClaims++;const extra=luck<.6?5:10;stars+=extra;bonus=extra+' bonus Stars';}
 if(visit===30){if(!s.owned.includes('trophy')){s.owned.push('trophy');bonus+=' · Garden trophy';}else{stars+=15;bonus+=' · Trophy duplicate → 15 Stars';}}s.visits++;s.xp+=Math.round(20*multiplier);s.stars+=stars;s.choices+=milestone?.choices??0;s.lastDay=day;s.lastReward={day,visit,xp:Math.round(20*multiplier),stars,bonus,item,milestone:milestone?visit:0,multiplier};return{state:s,claimed:true};
}
export type GardenAction={type:'exchange'}|{type:'theme';theme:GardenTheme}|{type:'sound';enabled:boolean}|{type:'equip';item:string|null}|{type:'buy'|'choose';item:string};
export function changeGarden(state:GardenState,a:GardenAction):GardenState{const s=structuredClone(state);if(a.type==='exchange'){if(s.choices>0&&s.owned.length===gardenItems.length){s.choices--;s.stars+=50;}}else if(a.type==='theme'&&gardenThemes.includes(a.theme))s.theme=a.theme;else if(a.type==='sound')s.sound=!!a.enabled;else if(a.type==='equip'&&(a.item===null||s.owned.includes(a.item)))s.equipped=a.item;else if(a.type==='buy'||a.type==='choose'){const item=gardenItems.find(i=>i.id===a.item);if(!item||s.owned.includes(item.id))return s;if(a.type==='choose'){if(!s.choices)return s;s.choices--;}else{if(s.stars<item.cost)return s;s.stars-=item.cost;}s.owned.push(item.id);s.equipped=item.id;}return s;}
