import {GIFEncoder,quantize,applyPalette} from 'gifenc';
const scope=self as unknown as {onmessage:((event:MessageEvent)=>void)|null;postMessage:(value:unknown,transfer?:Transferable[])=>void};
let encoder:ReturnType<typeof GIFEncoder>|undefined;let frames=0;
scope.onmessage=({data})=>{try{
 if(data.type==='start'){encoder=GIFEncoder();frames=0;scope.postMessage({ok:true});}
 else if(data.type==='frame'){if(!encoder||data.width*data.height>1_000_000||data.rgba.length!==data.width*data.height*4||frames>=30)throw new Error('Choose a smaller GIF.');const palette=quantize(data.rgba,256),indices=applyPalette(data.rgba,palette);encoder.writeFrame(indices,data.width,data.height,{palette,delay:data.delay,repeat:data.loop?0:-1,dispose:1});frames++;if(encoder.bytesView().length>60_000_000)throw new Error('The GIF exceeds 60 MB. Choose fewer pages or a smaller size.');scope.postMessage({ok:true});}
 else if(data.type==='finish'){if(!encoder||!frames)throw new Error('Add at least one GIF frame.');encoder.finish();const bytes=encoder.bytes();scope.postMessage({bytes},[bytes.buffer as ArrayBuffer]);encoder=undefined;}
 else throw new Error('Unknown GIF operation.');
 }catch(e){encoder=undefined;scope.postMessage({error:e instanceof Error?e.message:'GIF encoding failed.'});}};
