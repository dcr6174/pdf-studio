import fs from 'node:fs';
import {resolve} from 'node:path';

// Local capture helper. Start Chromium with --remote-debugging-port=9222.
// No external browser package, production access or uploaded private files.
const tabs=await(await fetch('http://127.0.0.1:9222/json')).json();
const tab=tabs.find(t=>t.type==='page');
if(!tab)throw Error('Start local Chromium with a page and remote debugging on port 9222.');
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let next=0;
const pending=new Map();
ws.addEventListener('message',event=>{
 const data=JSON.parse(event.data);
 const p=pending.get(data.id);
 if(p){pending.delete(data.id);if(data.error)p.reject(Error(data.error.message));else p.resolve(data.result);}
});
function cdp(method,params={}){return new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){
 const result=await cdp('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
 if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
 return result.result.value;
}
async function wait(expression){
 for(let n=0;n<120;n++){
  if(await evaluate(expression))return;
  await new Promise(r=>setTimeout(r,500));
 }
 throw Error('Timed out: '+expression+'\n'+await evaluate('document.body.innerText'));
}
await cdp('Page.enable');
await cdp('Runtime.enable');
const origin=process.env.GUIDE_CAPTURE_ORIGIN||'http://127.0.0.1:3000';
const mode=process.argv[2]||'inspect';
try{
 await cdp('Emulation.setDeviceMetricsOverride',{width:1100,height:740,deviceScaleFactor:1,mobile:false});
 await cdp('Page.navigate',{url:origin+'/tools/'+(mode==='reverse'?'reverse-pages':'split-pdf')});
 await wait(`!!document.querySelector('input[type=file]')`);
 await wait(`document.readyState==='complete'`);
 await wait(`(()=>{const e=document.querySelector('input[type=file]');const key=Object.keys(e).find(k=>k.startsWith('__reactProps'));return !!key&&typeof e[key].onChange==='function';})()`);
 const input=await cdp('Runtime.evaluate',{expression:`document.querySelector('input[type=file]')`});
 const filename=mode==='reverse'?'reverse-backs':'invoice-groups';
 await cdp('DOM.setFileInputFiles',{objectId:input.result.objectId,files:[resolve(`public/examples/guide-intent/${filename}-input.pdf`)]});
 await wait(`document.body.innerText.includes('1 file')&&document.body.innerText.includes('${mode==='reverse'?'3':'6'} pages')`);
 await wait(`!document.body.innerText.includes('Opening PDF')`);
 if(mode==='inspect'){
  console.log(await evaluate(`JSON.stringify({text:document.body.innerText,controls:[...document.querySelectorAll('input,select,button')].map(e=>({tag:e.tagName,type:e.type,text:e.innerText,label:e.getAttribute('aria-label'),placeholder:e.placeholder,value:e.value,options:e.tagName==='SELECT'?[...e.options].map(o=>({value:o.value,text:o.text})):undefined}))})`));
 }else{
  if(mode==='split'){
   await evaluate(`(()=>{const button=[...document.querySelectorAll('button')].find(b=>b.innerText==='One PDF');if(!button)throw Error('No output selector');button.click();})()`);
   await wait(`!![...document.querySelectorAll('[role=option]')].find(e=>e.innerText.includes('Page groups'))`);
   await evaluate(`(()=>{const option=[...document.querySelectorAll('[role=option]')].find(e=>e.innerText.includes('Page groups'));option.click();})()`);
   // Native value setters notify React rather than changing only DOM properties.
   await evaluate(`(()=>{const input=[...document.querySelectorAll('input')].find(e=>e.placeholder?.includes('3-5')||e.closest('label')?.innerText.includes('Page range'));if(!input)throw Error('No page range input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'2-3;5-6');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  }
  const controls=await evaluate(`JSON.stringify([...document.querySelectorAll('button')].map(e=>({text:e.innerText,disabled:e.disabled})))`);
  console.log('Buttons before export:',controls);
  await evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(e=>!e.disabled&&/^(Extract selected pages|Reverse pages|Reverse page order)$/.test(e.innerText.trim()));if(!b)throw Error('No enabled processing action');b.click();})()`);
  await wait(`!!document.querySelector('.merge-result-download')`);
  await evaluate(`document.querySelector('.merge-result-download').scrollIntoView({block:'center'})`);
  // Focus on completion/download; exclude PDF preview, as the editorial policy requires.
  const bounds=await evaluate(`(()=>{const panel=document.querySelector('.merge-result-page');const r=panel.getBoundingClientRect();return {x:Math.max(0,r.x+scrollX),y:Math.max(0,r.y+scrollY),width:Math.min(r.width,1100),height:428,scale:1};})()`);
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
  const shot=await cdp('Page.captureScreenshot',{format:'png',clip:bounds,captureBeyondViewport:true});
  fs.writeFileSync(`public/examples/guide-intent/${filename}-browser.png`,Buffer.from(shot.data,'base64'));
  console.log(await evaluate('document.body.innerText'));
 }
 console.log('Browser:',(await cdp('Browser.getVersion')).product);
}finally{ws.close();}
