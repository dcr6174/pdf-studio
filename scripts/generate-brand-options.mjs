import fs from 'node:fs/promises';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {PDFDocument,StandardFonts,rgb} from 'pdf-lib';
const dir='public/brand/options';await fs.mkdir(dir,{recursive:true});
const lavender='#8872ed';
const symbols=[
 '<path d="M30 42h34M30 54h27M30 66h34"/>',
 '<path d="M34 52h28m-14-14v28"/>',
 '<path d="m33 54 10 10 23-25"/>',
 '<path d="M28 38h40v32H28zM48 38v32"/>',
 '<path d="M32 36h32v40H32zM38 29h30v40"/>',
 '<path d="M30 48h16l8-12h16M46 48l8 16h16"/>',
 '<path d="M30 35h38v40H30zM40 45h18M40 55h18M40 65h12"/>',
 '<path d="M31 37h17v35H31zM52 37h17v35H52z"/>',
 '<path d="M50 32v28m-11-9 11 11 11-11M31 68h38"/>',
 '<path d="M30 68 61 37l9 9-31 31-12 3z"/>',
 '<path d="M29 43h20v28H29zM52 35h20v28H52z"/>',
 '<path d="M32 36h36v40H32zM41 36v40M32 49h36"/>',
 '<path d="M30 37h38v38H30zM43 50h12v12H43z"/>',
 '<path d="M34 46h32v27H34zM41 46v-8a9 9 0 0 1 18 0v8"/>',
 '<path d="M29 42h17v17H29zM53 42h17v17H53zM29 65h17M53 65h17"/>',
 '<path d="M31 33h34v43H31zM47 33v20l6-5 6 5V33"/>',
 '<path d="M31 41h38v30H31zM36 61l9-10 9 8 9-7"/><circle cx="58" cy="48" r="3"/>',
 '<path d="M32 33h37v42H32zM42 44h17M42 55h17M42 66h10"/>',
 '<path d="M28 47h18v23H28zM51 36h18v34H51zM30 78h39"/>',
 '<path d="M32 36h36v39H32zM43 46h14v18H43zM39 31h23"/>'
];
const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold);
for(let i=1;i<=40;i++){
 const simple=i>20,symbol=symbols[(i-1)%20],round=[8,16,24,32][Math.floor((i-1)/5)%4];
 const body=simple?`<rect x="8" y="8" width="84" height="84" rx="${round}" fill="${lavender}"/><g fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${symbol}</g>`:`<path d="M26 8H62L88 34V80Q88 92 76 92H24Q12 92 12 80V22Q12 8 26 8Z" fill="${lavender}"/><path d="M62 8V26Q62 34 70 34H88" fill="#e6dfff"/><g fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="translate(-1 5)">${symbol}</g>`;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 100 100"><title>PDF Studio exploration ${i}</title>${body}</svg>`;
 const base=String(i).padStart(2,'0');await fs.writeFile(`${dir}/option-${base}.svg`,svg);
 const image=await loadImage(Buffer.from(svg)),canvas=createCanvas(1024,1024),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,1024,1024);const png=canvas.toBuffer('image/png');await fs.writeFile(`${dir}/option-${base}.png`,png);
 if((i-1)%20===0){const page=doc.addPage([842,595]);page.drawText(i===1?'PDF Studio - document logo explorations':'PDF Studio - simple favicon explorations',{x:40,y:557,size:22,font:bold,color:rgb(.19,.14,.31)});page.drawText('New numbered options. These do not reproduce the missing original concept 78.',{x:40,y:532,size:10,font});}
 const page=doc.getPage(doc.getPageCount()-1),position=(i-1)%20,col=position%5,row=Math.floor(position/5),x=40+col*155,y=422-row*112,embedded=await doc.embedPng(png);
 page.drawImage(embedded,{x:x+35,y,width:62,height:62});page.drawText(`Option ${base}`,{x:x+35,y:y-15,size:11,font:bold});
 for(const [j,size] of [16,24,32].entries())page.drawImage(embedded,{x:x+j*38,y:y-54,width:size,height:size});
}
await fs.writeFile(`${dir}/pdf-studio-logo-comparison.pdf`,await doc.save());console.log('Generated 40 individual SVG/PNG options and a two-page small-size comparison. Existing brand unchanged.');
