import {tools} from './tools';
export const eventKinds=['visit','tool_open','process_start','process_success','process_error','download'] as const;
export type EventKind=typeof eventKinds[number];
export type ActivityEvent={id:string;kind:EventKind;toolId:string|null};
export type ActivityBatch={visitorId:string;visible:boolean;toolId:string|null;events:ActivityEvent[]};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const validTools=new Set(tools.map(t=>t.id));
function isObject(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null&&!Array.isArray(value);}
function exactKeys(o:Record<string,unknown>,allowed:string[]){if(Object.keys(o).some(k=>!allowed.includes(k)))throw new Error('Unexpected event properties.');}
export function parseActivity(value:unknown):ActivityBatch{
 if(!isObject(value))throw new Error('Invalid activity batch.');exactKeys(value,['visitorId','visible','toolId','events']);
 if(typeof value.visitorId!=='string'||!uuid.test(value.visitorId)||typeof value.visible!=='boolean'||!Array.isArray(value.events)||value.events.length>20)throw new Error('Invalid activity batch.');
 if(value.toolId!==null&&(typeof value.toolId!=='string'||!validTools.has(value.toolId)))throw new Error('Unknown tool.');
 const events:ActivityEvent[]=value.events.map(e=>{if(!isObject(e))throw new Error('Invalid event.');exactKeys(e,['id','kind','toolId']);if(typeof e.id!=='string'||!uuid.test(e.id)||!eventKinds.includes(e.kind as EventKind))throw new Error('Invalid event.');if(e.toolId!==null&&(typeof e.toolId!=='string'||!validTools.has(e.toolId)))throw new Error('Unknown tool.');if(e.kind!=='visit'&&e.toolId===null)throw new Error('A tool is required for this event.');return {id:e.id,kind:e.kind as EventKind,toolId:e.toolId as string|null};});
 return {visitorId:value.visitorId,visible:value.visible,toolId:value.toolId as string|null,events};
}
export const LIVE_MS=90_000,HOUR_MS=3_600_000,DAY_MS=86_400_000,RETENTION_MS=2*DAY_MS;
export type MetricsWindow={visitors:number;starts:number;completed:number;failed:number;downloads:number};
export type AnalyticsSummary={updatedAt:number;liveOnline:number;lastHour:MetricsWindow;last24Hours:MetricsWindow;liveTools:{toolId:string|null;visitors:number}[];tools:{toolId:string;opens:number;completed:number;failed:number;downloads:number;uniqueVisitors:number}[];activity:{hour:number;completed:number}[];firstRecordedAt:number|null};


export type OwnerPeriod="1h"|"24h"|"1m"|"5m"|"1y"|"all";
export type OwnerHistory={period:OwnerPeriod;since:number;firstRecordedAt:number|null;totals:{visits:number;starts:number;completed:number;failed:number;downloads:number};tools:{toolId:string;opens:number;completed:number;failed:number;downloads:number}[];activity:{time:number;completed:number;failed:number}[]};
