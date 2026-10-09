export const printableTools = [
  {slug:'mini-zine-maker',title:'Mini Zine Maker',description:'Eight pictures or PDF pages. One sheet. A tiny book to fold and keep.'},
  {slug:'photo-booth-strips',title:'Photo Booth Strip Maker',description:'Turn four favourite photos into classic, captioned photo strips.'},
  {slug:'custom-bingo',title:'Custom Bingo Maker',description:'Make unique bingo cards for your party, classroom or movie night.'},
  {slug:'giant-poster',title:'Giant Poster Maker',description:'Turn one picture into a wall-sized poster using your home printer.'},
  {slug:'photo-coloring-page',title:'Photo to Coloring Page',description:'Turn a photo into printable black-and-white outlines.'},
  {slug:'printable-flashcards',title:'Printable Flashcard Maker',description:'Build question-and-answer cards and print aligned fronts and backs.'},
] as const;
export type PrintableMode = (typeof printableTools)[number]['slug'];
export type Paper = 'A4' | 'Letter';
export type Card = {question:string;answer:string;source?:string};
export type Picture = {id:string;name:string;url:string;width:number;height:number};
export type PrintableSettings = {
  paper:Paper; title:string; accent:string; fit:'contain'|'cover'; guides:boolean;
  caption:string; stripStyle:'classic'|'midnight'|'rose'; monochrome:boolean;
  bingoWords:string; bingoCount:number; seed:number; freeCenter:boolean;
  posterWidth:number; overlap:number; margin:number;
  edgeThreshold:number; lineWeight:number; smoothing:number;
  cards:Card[]; duplex:'long'|'short';
};
export const sampleBingoWords = 'Someone says “quick question”\nA pet appears\nMic is muted\nA surprise snack\nA new idea\nSomeone laughs\nCoffee refill\nA little dance\nA great story\nA bright outfit\nA familiar song\nSomeone waves\nA funny photo\nA happy memory\nAn inside joke\nA celebration\nA group selfie\nSomeone arrives late\nA compliment\nA new friend\nA shared dessert\nSomeone sings\nA silly pun\nA big smile\nA surprise guest\nA favourite game\nA toast\nA friendly debate\nSomeone cheers\nA perfect moment';
export const sampleCards:Card[] = [
  {question:'What is active recall?',answer:'Practising retrieval from memory instead of only rereading.'},
  {question:'What is spaced repetition?',answer:'Reviewing information at increasing intervals.'},
  {question:'How can you check understanding?',answer:'Explain an idea in your own words and give an example.'},
  {question:'Why keep a source reference?',answer:'So you can check an answer against the original material.'},
  {question:'What makes a useful flashcard?',answer:'One clear question with a focused answer.'},
  {question:'When should you review a difficult card?',answer:'Sooner than an easy card; adjust the interval as you learn.'},
];
export function defaultPrintableSettings():PrintableSettings{return {
  paper:'A4',title:'Small things, big memories',accent:'#6a4dff',fit:'contain',guides:true,
  caption:'Good times · 2026',stripStyle:'classic',monochrome:false,
  bingoWords:sampleBingoWords,bingoCount:4,seed:1,freeCenter:true,
  posterWidth:600,overlap:10,margin:8,edgeThreshold:80,lineWeight:1,smoothing:1,
  cards:sampleCards.map(c=>({...c})),duplex:'long',
};}
export function paperSize(paper:Paper,landscape=false){const size=paper==='A4'?[210,297]:[215.9,279.4];return landscape?[size[1],size[0]]:size;}
function bounded(value:number,min:number,max:number,label:string){if(!Number.isFinite(value)||value<min||value>max)throw Error(`${label} must be between ${min} and ${max}.`);}
export function bingoWords(text:string){return [...new Set(text.split('\n').map(s=>s.trim()).filter(Boolean))];}
function rng(seed:number){let s=seed>>>0;return()=>{s=(s+0x6d2b79f5)>>>0;let n=Math.imul(s^(s>>>15),1|s);n^=n+Math.imul(n^(n>>>7),61|n);return((n^(n>>>14))>>>0)/4294967296;};}
export function bingoBoards(words:string[],count:number,seed:number,freeCenter:boolean){
  bounded(count,1,40,'Card count');if(!Number.isInteger(count))throw Error('Use a whole number of bingo cards.');
  if(words.length<(freeCenter?24:25))throw Error(`Add at least ${freeCenter?24:25} different entries, one per line.`);
  if(words.length>500||words.some(w=>w.length>90))throw Error('Use at most 500 entries with 90 characters per entry.');
  const random=rng(seed),seen=new Set<string>(),boards:string[][]=[];
  while(boards.length<count){const pool=[...words];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    const board=pool.slice(0,freeCenter?24:25);if(freeCenter)board.splice(12,0,'FREE');const key=board.join('\u0000');if(seen.has(key))continue;seen.add(key);boards.push(board);}
  return boards;
}
// The top row is upside down. Read order after the centre slit and folding is 1–8.
export const zinePanels = [{page:4,turn:true},{page:3,turn:true},{page:2,turn:true},{page:1,turn:true},{page:5,turn:false},{page:6,turn:false},{page:7,turn:false},{page:0,turn:false}] as const;
export function flashcardBackSlots(duplex:'long'|'short'){return duplex==='long'?[1,0,3,2,5,4]:[4,5,2,3,0,1];}
export function posterPlan(width:number,height:number,settings:Pick<PrintableSettings,'paper'|'posterWidth'|'overlap'|'margin'>){
  bounded(width,1,100000,'Image width');bounded(height,1,100000,'Image height');bounded(settings.posterWidth,100,2000,'Poster width in mm');bounded(settings.margin,5,20,'Print margin in mm');bounded(settings.overlap,0,20,'Overlap in mm');
  const [pw,ph]=paperSize(settings.paper),tw=pw-2*settings.margin,th=ph-2*settings.margin;
  const w=settings.posterWidth,h=w*height/width,stepX=tw-settings.overlap,stepY=th-settings.overlap;
  const cols=Math.max(1,Math.ceil((w-settings.overlap)/stepX)),rows=Math.max(1,Math.ceil((h-settings.overlap)/stepY));
  if(cols*rows>48)throw Error('This poster needs more than 48 sheets. Reduce its width or use a wider image.');
  return {width:w,height:h,cols,rows,sheetWidth:pw,sheetHeight:ph,tileWidth:tw,tileHeight:th,stepX,stepY,tiles:Array.from({length:cols*rows},(_,i)=>({row:Math.floor(i/cols),col:i%cols,x:i%cols*stepX,y:Math.floor(i/cols)*stepY}))};
}
export function coloringPixels(input:Uint8ClampedArray,width:number,height:number,threshold:number,lineWeight:number,smoothing:number){
  bounded(threshold,15,200,'Detail threshold');bounded(lineWeight,1,3,'Line weight');bounded(smoothing,0,3,'Smoothing');
  if(width*height>1_500_000||input.length!==width*height*4)throw Error('Choose a smaller picture for coloring.');
  let gray=new Float32Array(width*height);
  for(let i=0;i<gray.length;i++){const a=input[i*4+3]/255;gray[i]=(input[i*4]*.299+input[i*4+1]*.587+input[i*4+2]*.114)*a+255*(1-a);}
  for(let pass=0;pass<smoothing;pass++){const next=gray.slice();for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){const i=y*width+x;next[i]=(gray[i-width-1]+2*gray[i-width]+gray[i-width+1]+2*gray[i-1]+4*gray[i]+2*gray[i+1]+gray[i+width-1]+2*gray[i+width]+gray[i+width+1])/16;}gray=next;}
  const edge=new Uint8Array(width*height);
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){const i=y*width+x,gx=-gray[i-width-1]+gray[i-width+1]-2*gray[i-1]+2*gray[i+1]-gray[i+width-1]+gray[i+width+1],gy=-gray[i-width-1]-2*gray[i-width]-gray[i-width+1]+gray[i+width-1]+2*gray[i+width]+gray[i+width+1];if(Math.hypot(gx,gy)>threshold)edge[i]=1;}
  const out=new Uint8ClampedArray(input.length);out.fill(255);const radius=Math.round(lineWeight)-1;
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++)if(edge[y*width+x])for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){const xx=x+dx,yy=y+dy;if(xx<0||xx>=width||yy<0||yy>=height)continue;const i=(yy*width+xx)*4;out[i]=out[i+1]=out[i+2]=0;}
  return out;
}
