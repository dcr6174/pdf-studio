// Load processing libraries only when a document operation starts.
import type * as Engine from './pdf-engine';
export type {Loaded,PageItem,Mark,Options,Output} from './pdf-engine';
let pending:Promise<typeof Engine>|undefined;
function engine(){return pending??=(import('./pdf-engine').catch(error=>{pending=undefined;throw error;}));}
export const loadFile:typeof Engine.loadFile=async(...args)=>(await engine()).loadFile(...args);
export const render:typeof Engine.render=async(...args)=>(await engine()).render(...args);
export const renderer:typeof Engine.renderer=async(...args)=>(await engine()).renderer(...args);
export const fields:typeof Engine.fields=async(...args)=>(await engine()).fields(...args);
export const processPDF:typeof Engine.processPDF=async(...args)=>(await engine()).processPDF(...args);
