import type {TextJob,TextJobValue,WorkerReply,TextView,TextObject,TextEditOptions,TextEditResult,EditingFont} from './text-worker-protocol';
export class TextWorkerClient{
 private worker:Worker;private sequence=0;private jobs=new Map<number,{resolve:(value:TextJobValue)=>void;reject:(error:Error)=>void}>();private closed=false;
 constructor(){this.worker=new Worker(new URL('./text-edit.worker.ts',import.meta.url),{type:'module'});this.worker.onmessage=(e:MessageEvent<WorkerReply>)=>{const job=this.jobs.get(e.data.id);if(!job)return;this.jobs.delete(e.data.id);if(e.data.error)job.reject(new Error(e.data.error));else job.resolve(e.data.value);};this.worker.onerror=()=>{for(const job of this.jobs.values())job.reject(new Error('The PDF worker stopped. Retry opening the editor.'));this.jobs.clear();};}
 private request<T extends TextJobValue>(job:Omit<TextJob,'id'>):Promise<T>{if(this.closed)return Promise.reject(new Error('Editor is closed.'));const id=++this.sequence;return new Promise((resolve,reject)=>{this.jobs.set(id,{resolve:value=>resolve(value as T),reject});this.worker.postMessage({...job,id});});}
 inspect(bytes:Uint8Array,page:number,scale=1.5){return this.request<TextView>({method:'inspect',bytes,page,scale});}
 objects(bytes:Uint8Array,page:number){return this.request<TextObject[]>({method:'objects',bytes,page});}
 edit(bytes:Uint8Array,page:number,indices:number[],value:string,options:TextEditOptions){return this.request<TextEditResult>({method:'edit',bytes,page,indices,value,options});}
 validate(bytes:Uint8Array,expectedPages:number){return this.request<boolean>({method:'validate',bytes,expectedPages});}
 font(bytes:Uint8Array,page:number,index:number){return this.request<Uint8Array|undefined>({method:'font',bytes,page,indices:[index]});}
 validateFont(bytes:Uint8Array,name:string){return this.request<EditingFont>({method:'validateFont',bytes,value:name});}
 close(){this.closed=true;this.worker.terminate();for(const job of this.jobs.values())job.reject(new Error('Editor was closed.'));this.jobs.clear();}
}
