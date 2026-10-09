import {bingoBoards,bingoWords,coloringPixels,flashcardBackSlots,paperSize,posterPlan,zinePanels,type Picture,type PrintableMode,type PrintableSettings} from './lab-printables';

export type PrintSheet={canvas:HTMLCanvasElement;width:number;height:number;label:string};
export type PrintResult={sheets:PrintSheet[];instructions:string[];summary:string};
const px=4; // About 102 dpi: bounded memory, matching preview and export pixels.
function sheet(width:number,height:number,label:string):PrintSheet{const canvas=document.createElement('canvas');canvas.width=Math.round(width*px);canvas.height=Math.round(height*px);const c=canvas.getContext('2d')!;c.scale(px,px);c.fillStyle='white';c.fillRect(0,0,width,height);return{canvas,width,height,label};}
function context(s:PrintSheet){return s.canvas.getContext('2d')!;}
function rect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){c.fillStyle=color;c.fillRect(x,y,w,h);}
function line(c:CanvasRenderingContext2D,x:number,y:number,xx:number,yy:number,dashed=false,color='#b5b1c4'){c.save();c.strokeStyle=color;c.lineWidth=.25;c.setLineDash(dashed?[2,1.5]:[]);c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();c.restore();}
function text(c:CanvasRenderingContext2D,value:string,x:number,y:number,w:number,h:number,max=5,color='#251c3b',bold=false){
  c.save();c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;
  for(let size=max;size>=2;size-=.25){c.font=`${bold?'700':'400'} ${size}px system-ui, sans-serif`;const lines:string[]=[];let current='';
    for(const paragraph of value.split('\n')){for(const word of paragraph.split(/\s+/).filter(Boolean)){const proposed=current?current+' '+word:word;if(c.measureText(proposed).width<=w){current=proposed;continue;}if(current){lines.push(current);current='';}if(c.measureText(word).width>w){for(const char of [...word]){if(c.measureText(current+char).width>w){lines.push(current);current='';}current+=char;}}else current=word;}lines.push(current);current='';}
    if(lines.length*size*1.3<=h&&lines.every(l=>c.measureText(l).width<=w)){lines.forEach((l,i)=>c.fillText(l,x+w/2,y+h/2+(i-(lines.length-1)/2)*size*1.3));c.restore();return;}
  }
  c.restore();throw Error('Some text is too long to fit. Shorten the title or card text and try again.');
}
async function image(p:Picture,signal:AbortSignal){signal.throwIfAborted();const img=new Image();img.src=p.url;await img.decode();signal.throwIfAborted();return img;}
function picture(c:CanvasRenderingContext2D,img:CanvasImageSource,width:number,height:number,x:number,y:number,w:number,h:number,fit:'contain'|'cover'){
  const scale=fit==='cover'?Math.max(w/width,h/height):Math.min(w/width,h/height),dw=width*scale,dh=height*scale;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);c.restore();
}
function corners(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number){for(const xx of [x,x+w])for(const yy of [y,y+h]){line(c,xx-2,yy,xx+2,yy);line(c,xx,yy-2,xx,yy+2);}}
function validate(settings:PrintableSettings){if(!/^#[a-f\d]{6}$/i.test(settings.accent))throw Error('Choose a valid accent colour.');if(settings.title.length>120||settings.caption.length>100)throw Error('Use a shorter title or caption.');}
export function releaseResult(result:PrintResult|undefined){result?.sheets.forEach(s=>{s.canvas.width=0;s.canvas.height=0;});}
export async function renderPrintable(mode:PrintableMode,pictures:Picture[],settings:PrintableSettings,signal:AbortSignal,onProgress:(label:string)=>void=()=>{}):Promise<PrintResult>{
  validate(settings);signal.throwIfAborted();const result:PrintResult={sheets:[],instructions:[],summary:''};
  const [pw,ph]=paperSize(settings.paper);
  const add=(w:number,h:number,label:string)=>{const s=sheet(w,h,label);result.sheets.push(s);return s;};
  const tick=async(label:string)=>{onProgress(label);await new Promise<void>(r=>setTimeout(r,0));signal.throwIfAborted();};
  try{
  if(mode==='mini-zine-maker'){
    if(pictures.length!==8)throw Error('Add exactly eight images or eight PDF pages for your mini zine.');
    const [w,h]=paperSize(settings.paper,true),s=add(w,h,'Fold-ready mini zine'),c=context(s),cellW=w/4,cellH=h/2;
    for(let i=0;i<8;i++){await tick(`Arranging page ${i+1} of 8`);const panel=zinePanels[i],p=pictures[panel.page],img=await image(p,signal),x=(i%4)*cellW,y=Math.floor(i/4)*cellH;
      c.save();c.translate(x,y);if(panel.turn){c.translate(cellW,cellH);c.rotate(Math.PI);}picture(c,img,p.width,p.height,6,6,cellW-12,cellH-18,settings.fit);text(c,String(panel.page+1),6,cellH-10,cellW-12,4,2.8);c.restore();}
    if(settings.guides){for(let i=1;i<4;i++)line(c,i*cellW,6,i*cellW,h-6,true);line(c,6,h/2,w-6,h/2,true);line(c,cellW,h/2,3*cellW,h/2,false,'#bd3e50');}
    result.summary='8 pages · 1 sheet · 1 centre cut';result.instructions=['Print landscape, single-sided, at Actual size / 100%.','Fold the sheet in half both ways, then fold into eight equal panels. Unfold.','Cut only the centre horizontal slit between the first and third vertical folds (the red line when guides are on).','Fold lengthwise, push the two ends towards each other, and collapse into a book. Page 1 is the cover.'];
  }else if(mode==='photo-booth-strips'){
    if(pictures.length!==4)throw Error('Add exactly four photos for your strip.');
    const s=add(pw,ph,'Two matching photo strips'),c=context(s),sw=50,sh=190,top=(ph-sh)/2,background=settings.stripStyle==='midnight'?'#20202d':settings.stripStyle==='rose'?'#ffe5ed':'#fff',ink=settings.stripStyle==='midnight'?'#fff':'#251c3b';
    const imgs=[];for(const p of pictures){await tick('Preparing photo '+(imgs.length+1));imgs.push(await image(p,signal));}
    for(const x of [pw/2-sw-8,pw/2+8]){rect(c,x,top,sw,sh,background);for(let i=0;i<4;i++){c.save();if(settings.monochrome)c.filter='grayscale(1)';picture(c,imgs[i],pictures[i].width,pictures[i].height,x+4,top+4+i*40,42,37,settings.fit);c.restore();}text(c,settings.caption,x+4,top+165,42,19,4,ink,true);if(settings.guides)corners(c,x,top,sw,sh);}
    result.summary='2 matching strips · 50 × 190 mm';result.instructions=['Print portrait at Actual size / 100%.','Cut around the strip edges. Each strip is 50 × 190 mm.','Use Cover to fill photo windows, or Fit to keep the complete image.'];
  }else if(mode==='custom-bingo'){
    const boards=bingoBoards(bingoWords(settings.bingoWords),settings.bingoCount,settings.seed,settings.freeCenter);
    for(let i=0;i<boards.length;i++){await tick(`Making bingo card ${i+1} of ${boards.length}`);const s=add(pw,ph,'Bingo card '+(i+1)),c=context(s),size=Math.min(pw-24,ph-75),cell=size/5,x=(pw-size)/2,y=61;
      text(c,settings.title||'Bingo!',12,12,pw-24,20,8,settings.accent,true);text(c,'B I N G O',x,39,size,14,8,settings.accent,true);
      for(let j=0;j<25;j++){const xx=x+j%5*cell,yy=y+Math.floor(j/5)*cell;rect(c,xx,yy,cell,cell,j===12&&settings.freeCenter?settings.accent:'#faf8ff');c.strokeStyle=settings.accent;c.lineWidth=.3;c.strokeRect(xx,yy,cell,cell);text(c,boards[i][j],xx+2,yy+2,cell-4,cell-4,4,j===12&&settings.freeCenter?'#fff':'#251c3b',j===12);}
      text(c,`Card ${i+1} · Set ${settings.seed}`,12,ph-20,pw-24,8,3);}
    result.summary=`${boards.length} unique 5 × 5 cards`;result.instructions=['Print each card at Actual size / 100%.','Give each player a different card. Use your original entry list as the calling list.','Choose New set to reshuffle the cards before generating another batch.'];
  }else if(mode==='giant-poster'){
    if(pictures.length!==1)throw Error('Choose one image for your poster.');const p=pictures[0],plan=posterPlan(p.width,p.height,settings),img=await image(p,signal);
    for(let i=0;i<plan.tiles.length;i++){await tick(`Preparing poster sheet ${i+1} of ${plan.tiles.length}`);const t=plan.tiles[i],s=add(pw,ph,`Row ${t.row+1}, column ${t.col+1}`),c=context(s);c.save();c.beginPath();c.rect(settings.margin,settings.margin,plan.tileWidth,plan.tileHeight);c.clip();c.drawImage(img,settings.margin-t.x,settings.margin-t.y,plan.width,plan.height);c.restore();
      if(settings.guides)corners(c,settings.margin,settings.margin,Math.min(plan.tileWidth,plan.width-t.x),Math.min(plan.tileHeight,plan.height-t.y));text(c,`R${t.row+1} C${t.col+1} · ${i+1}/${plan.tiles.length}`,5,ph-5,pw-10,4,2.4);}
    result.summary=`${Math.round(plan.width)} × ${Math.round(plan.height)} mm · ${plan.cols} columns × ${plan.rows} rows · ${plan.tiles.length} sheets`;
    result.instructions=['Print portrait at Actual size / 100%. Turn off Fit to page.','Arrange sheets by their row and column labels.','Trim white margins and align neighbouring pictures using the chosen overlap. Tape from the back.','The final outer edge may need trimming. Image sharpness depends on the source photo and poster size.'];
  }else if(mode==='photo-coloring-page'){
    if(pictures.length!==1)throw Error('Choose one photo to make a coloring page.');const p=pictures[0],img=await image(p,signal),scale=Math.min(1,1200/Math.max(p.width,p.height)),w=Math.max(1,Math.round(p.width*scale)),h=Math.max(1,Math.round(p.height*scale)),scratch=document.createElement('canvas');scratch.width=w;scratch.height=h;
    const sc=scratch.getContext('2d',{willReadFrequently:true})!;sc.drawImage(img,0,0,w,h);await tick('Finding outlines…');const data=sc.getImageData(0,0,w,h);data.data.set(coloringPixels(data.data,w,h,settings.edgeThreshold,settings.lineWeight,settings.smoothing));sc.putImageData(data,0,0);const s=add(pw,ph,'Your coloring page'),c=context(s);picture(c,scratch,w,h,12,12,pw-24,ph-24,'contain');scratch.width=0;scratch.height=0;
    result.summary='Black-and-white outlines · 1 sheet';result.instructions=['Try a well-lit photo with a simple background.','Lower Detail threshold includes more edges; raise it for fewer lines. Smoothing reduces texture.','Print at Actual size / 100%. This is an outline filter; complex photos may need several adjustments.'];
  }else{
    const cards=settings.cards;if(!cards.length||cards.length>60)throw Error('Create between 1 and 60 flashcards.');if(cards.some(c=>!c.question.trim()||!c.answer.trim()))throw Error('Fill in both the question and answer on every card.');if(cards.some(c=>c.question.length>800||c.answer.length>1200||(c.source?.length??0)>100))throw Error('Shorten the text on your cards before printing.');
    const margin=12,gap=0,cw=(pw-margin*2)/2,ch=(ph-margin*2)/3,backSlots=flashcardBackSlots(settings.duplex);
    for(let offset=0;offset<cards.length;offset+=6){for(const back of [false,true]){await tick(`Preparing ${back?'answers':'questions'} ${Math.floor(offset/6)+1}`);const s=add(pw,ph,`${back?'Answers':'Questions'} · sheet ${Math.floor(offset/6)+1}`),c=context(s);
      for(let slot=0;slot<6;slot++){const index=offset+(back?backSlots[slot]:slot),card=cards[index];if(!card)continue;const x=margin+slot%2*(cw+gap),y=margin+Math.floor(slot/2)*(ch+gap);rect(c,x+2,y+2,cw-4,1,settings.accent);text(c,back?card.answer:card.question,x+6,y+10,cw-12,ch-28,back?5:6,'#251c3b',!back);text(c,`#${index+1}${card.source?' · '+card.source:''}`,x+4,y+ch-13,cw-8,8,2.6,settings.accent);}
      if(settings.guides){for(let row=0;row<=3;row++)line(c,margin,margin+row*ch,pw-margin,margin+row*ch,true);for(let col=0;col<=2;col++)line(c,margin+col*cw,margin,margin+col*cw,ph-margin,true);}}}
    result.summary=`${cards.length} cards · ${result.sheets.length/2} double-sided sheets`;
    result.instructions=[`Print portrait, double-sided, flip on the ${settings.duplex==='long'?'long':'short'} edge, at Actual size / 100%.`,'Print the first front/back pair as a test before printing the whole batch. Printer alignment can vary.','The question and answer with the same number belong to one card. Cut along the dashed lines.','Answers are supplied and reviewed by you. PDF text import does not generate answers automatically.'];
  }
  signal.throwIfAborted();return result;
  }catch(e){releaseResult(result);throw e;}
}
export async function printablePDF(result:PrintResult,signal:AbortSignal,onProgress:(label:string)=>void=()=>{}){
  const {PDFDocument}=await import('pdf-lib');const pdf=await PDFDocument.create();
  for(let i=0;i<result.sheets.length;i++){signal.throwIfAborted();onProgress(`Exporting sheet ${i+1} of ${result.sheets.length}`);await new Promise<void>(r=>setTimeout(r,0));const s=result.sheets[i],blob=await new Promise<Blob>((resolve,reject)=>s.canvas.toBlob(b=>b?resolve(b):reject(Error('Could not export this sheet.')),'image/png'));const img=await pdf.embedPng(await blob.arrayBuffer());const page=pdf.addPage([s.width*72/25.4,s.height*72/25.4]);page.drawImage(img,{x:0,y:0,width:page.getWidth(),height:page.getHeight()});}
  signal.throwIfAborted();return new Uint8Array(await pdf.save());
}
export function samplePictures(count:number):Picture[]{return Array.from({length:count},(_,i)=>{const canvas=document.createElement('canvas');canvas.width=720;canvas.height=900;const c=canvas.getContext('2d')!,colors=['#ffc5a6','#c5e9e0','#d9c7ff','#ffd9e6','#c6e4ff','#ffdf99','#d3e8ba','#f1c4e1'];c.fillStyle=colors[i%8];c.fillRect(0,0,720,900);c.fillStyle='#fff8ed';c.beginPath();c.arc(500,230,110,0,Math.PI*2);c.fill();c.fillStyle='#6a4dff';c.beginPath();c.moveTo(0,700);c.quadraticCurveTo(250,370,440,690);c.quadraticCurveTo(620,470,720,620);c.lineTo(720,900);c.lineTo(0,900);c.fill();c.fillStyle='#2b2444';c.font='bold 50px sans-serif';c.fillText(['Little adventures','Slow mornings','Bright ideas','Good company','New horizons','Warm memories','Small wonders','See you soon'][i%8],35,110);return{id:'sample-'+i,name:'Example '+(i+1),url:canvas.toDataURL('image/png'),width:720,height:900};});}
