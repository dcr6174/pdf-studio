/** Paste-to-open: copy a file in your file manager (or a screenshot), press Ctrl+V on a tool page. */
type ClipboardLike={files?:ArrayLike<File>|null;items?:ArrayLike<{kind:string;getAsFile():File|null}>|null};

const pad=(n:number)=>String(n).padStart(2,'0');
const stamp=(d:Date)=>`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

/** Files on the clipboard, empty ones dropped. Pasted screenshots arrive as "image.png"; give them a unique name. */
export function filesFromClipboard(data:ClipboardLike|null|undefined,now=new Date()):File[]{
 const out:File[]=[];
 const add=(f:File|null|undefined)=>{if(f&&f.size>0)out.push(f);};
 if(data?.files&&data.files.length){for(let i=0;i<data.files.length;i++)add(data.files[i]);}
 else if(data?.items){for(let i=0;i<data.items.length;i++){const it=data.items[i];if(it.kind==='file')add(it.getAsFile());}}
 return out.map(f=>{
  const m=/^image\.(png|jpe?g|webp|gif)$/i.exec(f.name);
  return m?new File([f],`pasted-image-${stamp(now)}.${m[1].toLowerCase()}`,{type:f.type,lastModified:f.lastModified}):f;
 });
}

/** Never take over a paste that is meant for a text field. */
export function isEditableTarget(target:EventTarget|null){
 const el=target as (HTMLElement|null);
 if(!el||typeof el.tagName!=='string')return false;
 const tag=el.tagName.toUpperCase();
 if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return true;
 if(el.isContentEditable===true)return true;
 return !!el.closest?.('[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"],[role="dialog"],[role="alertdialog"]');
}
