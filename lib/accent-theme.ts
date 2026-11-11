export const ACCENT_KEY='pdf-studio-accent';
export const accentThemes=[
 {name:'Violet Dream',color:'#7045dc'}, {name:'Ocean Breeze',color:'#1766d2'},
 {name:'Emerald Forest',color:'#087b4e'}, {name:'Sunset Glow',color:'#bb4616'},
 {name:'Rose Petal',color:'#be355f'}, {name:'Teal Lagoon',color:'#087e81'},
 {name:'Indigo Night',color:'#4b49bb'}, {name:'Golden Hour',color:'#936500'},
 {name:'Slate Mist',color:'#586373'}, {name:'Berry Blast',color:'#a12c9d'},
] as const;
export function accentLuminance(hex:string){const a=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722;}
export function accessibleAccent(hex:string,dark:boolean){
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));const bg=dark?.025:.98;
 for(let n=0;n<=100;n++){const t=n/100;const candidate='#'+rgb.map(v=>Math.round(v+(dark?255-v:-v)*t).toString(16).padStart(2,'0')).join('');const lum=accentLuminance(candidate),ratio=(Math.max(bg,lum)+.05)/(Math.min(bg,lum)+.05);if(ratio>=4.7)return candidate;}
 return dark?'#ffffff':'#000000';
}
export function applyAccent(raw:string){
 if(!/^#[0-9a-f]{6}$/i.test(raw))return;
 const root=document.documentElement,dark=root.dataset.theme==='dark',color=accessibleAccent(raw,dark),l=accentLuminance(color);
 root.dataset.accent=raw;root.style.setProperty('--primary',color);root.style.setProperty('--theme-accent',color);root.style.setProperty('--primary-foreground',l>.179?'#101218':'#ffffff');root.style.setProperty('--accent-choice',raw);
 root.style.setProperty('--fx-a',color);root.style.setProperty('--fx-b',color);root.style.setProperty('--fx-c',color);root.style.setProperty('--fx-grad',color);root.style.setProperty('--fx-glow',`0 8px 24px color-mix(in srgb,${color} 22%,transparent)`);
}
