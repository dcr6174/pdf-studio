'use client';
import {useRef} from 'react';
import {Smile} from 'lucide-react';
const emojis=[['😀','Smile'],['😂','Laugh'],['😍','Love'],['😎','Cool'],['🤔','Thinking'],['👍','Thumbs up'],['👏','Applause'],['🙏','Thanks'],['❤️','Heart'],['⭐','Star'],['✅','Check'],['❌','Cross'],['⚠️','Warning'],['📌','Pin'],['🎉','Celebrate'],['🔥','Fire'],['💡','Idea'],['📅','Calendar'],['🚀','Rocket'],['🌟','Glowing star']];
export function EmojiPicker({onInsert}:{onInsert:(image:string)=>void}){
 const panel=useRef<HTMLDetailsElement>(null);
 function insert(emoji:string){const canvas=document.createElement('canvas');canvas.width=160;canvas.height=160;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.font='112px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(emoji,80,88);onInsert(canvas.toDataURL('image/png'));if(panel.current)panel.current.open=false;}
 return <details ref={panel} className="emoji-picker"><summary aria-label="Add emoji" title="Add emoji"><Smile size={18}/></summary><div className="emoji-grid" role="group" aria-label="Choose an emoji">{emojis.map(([emoji,name])=><button type="button" key={name} aria-label={'Insert '+name+' emoji'} onClick={()=>insert(emoji)}>{emoji}</button>)}</div></details>;
}
