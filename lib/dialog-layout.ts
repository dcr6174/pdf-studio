import type {CSSProperties} from 'react';
/** Full-screen panels must never inherit the centered dialog's -50% translations. */
export function dialogLayout(fullscreen:boolean,style?:CSSProperties){
 if(fullscreen)return {className:'fixed inset-0 z-50 block w-full max-w-none overflow-y-auto rounded-none border-0 bg-background p-6 outline-none',style:{...style,position:'fixed',inset:0,top:0,right:0,bottom:0,left:0,transform:'none',translate:'none',width:'100%',maxWidth:'100%',height:'100dvh',maxHeight:'100dvh',overflowY:'auto'} as CSSProperties};
 return {className:'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg',style};
}
