import type {PuzzleFamily} from '@/lib/puzzle-catalog';
export function PuzzleArtwork({family}:{family:PuzzleFamily}){const letters=family==='sudoku'?'123456789':family==='queens'?'PUPPYPARK':family==='cipher'?'SECRETKEY':family==='hex'?'→↘↙←↖↗→↘↙':family==='chain'?'248248248':family==='picture'?'✿☀✦☁▧☂❋☾✧':family==='tiles'?'✿◆●✿◆●✿◆●':family==='blocks'?'■■·■··■■■':'BUDDYPAGE';return <svg className="arcade-artwork" viewBox="0 0 320 180" aria-hidden="true"><circle cx="162" cy="90" r="74" fill="#ffffff08"/>{[...letters].map((letter,i)=><g key={i} transform={`translate(${83+i%3*52} ${16+Math.floor(i/3)*50})`}><rect width="46" height="44" rx={family==='hex'?18:9} fill={['#d9c7ff','#b4ebd7','#ffe1a9'][i%3]}/><text x="23" y="29" textAnchor="middle" fontFamily="system-ui" fontSize="23" fontWeight="750" fill="#271c42">{letter}</text></g>)}<path d="M44 59l4 11 12 3-12 4-4 11-4-11-11-4 11-3zM270 116l3 8 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#e6cfff"/></svg>;}
/** Six original 400 × 400 illustrations inspired by world landmarks, historic figures and classic public-domain art. No remote assets. */
export const pictureSceneNames=['Taj Mahal · India','Mona Lisa · Italy','Eiffel Tower · France','Subhas Chandra Bose · India','Great Pyramid · Egypt','Hawa Mahal · India'];
export function PuzzleScene({scene=0}:{scene?:number}){
 const n=((Math.floor(scene)%pictureSceneNames.length)+pictureSceneNames.length)%pictureSceneNames.length;
 const sky=['#c4e2f5','#3b4d42','#bddff5','#c9b09e','#f7d99d','#f6c2b4'][n];
 const star=(x:number,y:number,size:number)=><path key={x+'-'+y} d={'M'+x+' '+(y-size)+'v'+(size*2)+'m-'+size+' -'+size+'h'+(size*2)} stroke="#fff8e2" strokeWidth="2"/>;
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label={pictureSceneNames[n]}>
 <rect width="400" height="400" fill={sky}/>
 {n===0&&<g>
 <rect y="310" width="400" height="90" fill="#80c4b0"/><path d="M0 335H400M0 358H400M0 380H400" stroke="#e7fff5" strokeWidth="3"/><path d="M160 400 188 310h24l28 90" fill="#a3d9e0"/>
 <rect x="97" y="172" width="206" height="153" rx="8" fill="#f8f2e6" stroke="#b4b7bb" strokeWidth="3"/><path d="M142 182Q137 102 200 80Q263 101 258 182" fill="#f5f3ef" stroke="#b7bcba" strokeWidth="4"/><circle cx="200" cy="79" r="14" fill="#f5f3ef"/><path d="M200 66V43" stroke="#a5adb0" strokeWidth="5"/>
 {[72,328].map(x=><g key={x}><rect x={x-11} y="126" width="22" height="203" fill="#f7f5eb" stroke="#b0b5ba" strokeWidth="3"/><path d={'M'+(x-13)+' 127q13-38 26 0'} fill="#f7f5eb"/><path d={'M'+x+' 85v17'} stroke="#9aa5a7" strokeWidth="4"/></g>)}
 <path d="M173 325V246q27-34 54 0v79" fill="#5b829d"/><path d="M115 268q17-32 35 0v57h-35m135-57q17-32 35 0v57h-35" fill="#b9d1d4"/><path d="M109 206h182M109 226h182" stroke="#d6ccbd" strokeWidth="3"/><circle cx="200" cy="120" r="7" fill="#b0d2dd"/>{star(54,64,7)}{star(337,52,6)}
 </g>}
 {n===1&&<g>
 <rect width="400" height="400" fill="#425b47"/><path d="M0 198Q96 136 182 206T400 174V400H0" fill="#647f74"/><path d="M0 272Q120 192 231 261T400 233V400H0" fill="#acc0aa"/>
 <path d="M81 400q-5-120 31-178 27-35 87-39 64 0 94 44 30 53 31 173" fill="#302b29"/><path d="M113 239q-23-131 87-162 120 21 91 177" fill="#282821"/>
 <path d="M146 142q54-44 108 4l-6 100q-49 47-99 1z" fill="#d1a27d"/><path d="M153 187q19-10 37 0m20 0q18-10 36 0" stroke="#513a31" strokeWidth="4" fill="none"/><path d="M181 225q20 10 40-1" stroke="#845a48" strokeWidth="3" fill="none"/><path d="M172 278q28 22 57 0" stroke="#e9c5a0" strokeWidth="16"/>
 <path d="M102 400q16-96 78-114l20 37 21-37q73 16 83 114" fill="#3c3d35"/><path d="M96 390q105-28 209 0" stroke="#9b7861" strokeWidth="17" fill="none"/><path d="M157 362q28-19 53 7 28-17 56 1" fill="none" stroke="#e2b99a" strokeWidth="12" strokeLinecap="round"/>
 </g>}
 {n===2&&<g>
 <rect y="277" width="400" height="123" fill="#a8d7b0"/><path d="M0 315H400" stroke="#ddebe5" strokeWidth="8"/><circle cx="79" cy="89" r="35" fill="#fff2bd"/>
 <path d="M199 48 182 157 133 322M199 48 219 157 268 322M149 290H252M174 164H227M150 236H251M192 85h16" stroke="#785f65" strokeWidth="11" fill="none" strokeLinecap="round"/><path d="M135 322q65-88 130 0M155 280l89-94m-96 56 93-93m-67 16 77 117m-68-135 85 139" stroke="#785f65" strokeWidth="5" fill="none"/><path d="M120 328H278" stroke="#564b55" strokeWidth="14"/><path d="M0 361q120-39 220 0t180 0" fill="none" stroke="#77b5a3" strokeWidth="19"/>
 </g>}
 {n===3&&<g>
 <rect y="260" width="400" height="140" fill="#c59d7c"/><path d="M28 300q70-75 160-31t183-20" stroke="#f1d5b5" strokeWidth="24" fill="none"/>
 <path d="M72 400q-1-121 53-153 39-19 82-17 76-5 100 34 22 49 22 136" fill="#425e5f"/><path d="M115 286 200 343l88-58" fill="none" stroke="#c9c6b1" strokeWidth="15"/>
 <path d="M144 132q0-86 55-88 65 3 65 85v74q-18 50-65 57-43-6-57-55" fill="#b87955"/>
 <path d="M138 136q-27-66 23-110 41-32 93 0 34 29 23 100" fill="#343434"/><path d="M119 60q75-47 161-8l-7 38q-72 10-146-2z" fill="#2f4a60"/><rect x="129" y="85" width="144" height="16" rx="5" fill="#25374e"/>
 <path d="M146 158h45m19 0h45" stroke="#232a2e" strokeWidth="8" fill="none"/><rect x="148" y="143" width="39" height="24" rx="7" stroke="#29313a" fill="none" strokeWidth="5"/><rect x="212" y="143" width="39" height="24" rx="7" stroke="#29313a" fill="none" strokeWidth="5"/><path d="M187 154h25" stroke="#29313a" strokeWidth="4"/><path d="M173 217q27 16 54 0" stroke="#583930" strokeWidth="4" fill="none"/><path d="M200 262v139" stroke="#ded9c7" strokeWidth="10"/><circle cx="203" cy="307" r="8" fill="#bf9c6e"/>
 </g>}
 {n===4&&<g><circle cx="322" cy="76" r="40" fill="#ffe4a3"/><path d="M0 287q103-67 208-11t192-17V400H0" fill="#e2ae76"/><path d="M13 321 188 79 356 321z" fill="#d4a56e"/><path d="M188 79 356 321H189z" fill="#ac8061"/><path d="M185 321 308 144 391 321z" fill="#d9b37f"/><path d="M0 371q136-48 400-12" stroke="#f5d093" strokeWidth="29" fill="none"/>{star(47,77,7)}{star(100,44,5)}</g>}
 {n===5&&<g><rect y="298" width="400" height="102" fill="#d4b78f"/><rect x="40" y="67" width="321" height="254" fill="#d47666"/><path d="M35 76H368v32H35" fill="#e79c7f"/><path d="M35 141H368M35 208H368M35 279H368" stroke="#f8c3a0" strokeWidth="12"/>
 {Array.from({length:4},(_,row)=>Array.from({length:7},(_,col)=><g key={row+'-'+col}><path d={'M'+(58+col*45)+' '+(112+row*54)+'q15-24 30 0v31h-30z'} fill="#733e44" stroke="#f5c19a" strokeWidth="4"/><path d={'M'+(65+col*45)+' '+(115+row*54)+'v24m10-24v24'} stroke="#daa080" strokeWidth="2"/></g>))}
 <path d="M25 80q34-71 67 0m14 0q34-71 67 0m14 0q34-71 67 0m14 0q34-71 67 0" fill="#d47666" stroke="#f5be96" strokeWidth="7"/></g>}
 <rect x="0.75" y="0.75" width="398.5" height="398.5" fill="none" stroke="#fff9eb" strokeOpacity=".55" strokeWidth="2"/>
 </svg>;
}
