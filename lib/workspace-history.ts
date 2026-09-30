// Immutable document snapshots share source byte arrays; history never copies PDFs.
export class WorkspaceHistory<T> {
  past:T[]=[]; future:T[]=[]; group=''; changedAt=0;
  constructor(public current:T, public limit=20){}
  set(next:T, group='', now=Date.now()) {
    if(next===this.current)return;
    if(!group || group!==this.group || now-this.changedAt>700) {
      this.past.push(this.current); if(this.past.length>this.limit)this.past.shift();
    }
    this.current=next; this.future=[]; this.group=group; this.changedAt=now;
  }
  undo(){const prev=this.past.pop();if(prev!==undefined){this.future.push(this.current);this.current=prev;}this.group='';return this.current;}
  redo(){const next=this.future.pop();if(next!==undefined){this.past.push(this.current);this.current=next;}this.group='';return this.current;}
  reset(next:T){this.current=next;this.past=[];this.future=[];this.group='';}
}
