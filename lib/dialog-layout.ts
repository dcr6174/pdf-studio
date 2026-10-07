import type {CSSProperties} from 'react';
/** Full-screen panels must never inherit the centered dialog's -50% translations. */
export function dialogLayout(fullscreen:boolean,style?:CSSProperties){
 if(fullscreen)return {className:'fixed inset-0 z-50 block w-full max-w-none overflow-y-auto rounded-none border-0 bg-background p-6 outline-none',style:{...style,position:'fixed',inset:0,top:0,right:0,bottom:0,left:0,transform:'none',translate:'none',width:'100%',maxWidth:'100%',height:'100dvh',maxHeight:'100dvh',overflowY:'auto'} as CSSProperties};
 return {className:'fixed z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg outline-none sm:max-w-lg',style:{position:'fixed',top:'50%',left:'50%',right:'auto',bottom:'auto',transform:'translate(-50%, -50%)',translate:'none',maxHeight:'calc(100dvh - 32px)',overflowY:'auto',boxSizing:'border-box',...style} as CSSProperties};
}
