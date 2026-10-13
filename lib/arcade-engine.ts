import type {GameMode} from './arcade-catalog';
export type Point={x:number;y:number};
export type Ball=Point&{vx:number;vy:number;color?:number};
export type Block=Point&{w:number;h:number;color:number};
export type GameState={mode:GameMode;seed:number;score:number;time:number;over:boolean;won:boolean;message:string;board:number[];revealed:number[];matched:number[];selected:number[];moves:number;cooldown:number;target:number;level:number;aim:Point;ball:Ball|null;blocks:Block[];snake:Point[];direction:Point;queued:Point;fruit:Point;accumulator:number;wind:number;lives:number;paddle:number;velocity:number;playerY:number;playerV:number;spawn:number;obstacles:Point[];stars:Point[];undo:{board:number[];score:number}[]};
export type GameInput={type:'left'|'right'|'up'|'down'|'action'|'cell'|'aim'|'undo';index?:number;x?:number;y?:number};
export function random(s:GameState){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
const integer=(s:GameState,n:number)=>Math.floor(random(s)*n);
export function shuffle<T>(s:GameState,values:T[]){for(let i=values.length-1;i>0;i--){const j=integer(s,i+1);[values[i],values[j]]=[values[j],values[i]];}return values;}
function tile(s:GameState){const free=s.board.map((v,i)=>v===0?i:-1).filter(i=>i>=0);if(free.length)s.board[free[integer(s,free.length)]]=random(s)<.9?2:4;}
function fruit(s:GameState){const free:Point[]=[];for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(!s.snake.some(p=>p.x===x&&p.y===y))free.push({x,y});if(!free.length){finish(s,true,'You filled the board!');return;}s.fruit=free[integer(s,free.length)];}
function finish(s:GameState,won:boolean,message:string){s.over=true;s.won=won;s.message=message;}
function odd(s:GameState){s.target=integer(s,16);s.board=Array(16).fill(0);s.board[s.target]=1;}
export function createGame(mode:GameMode,seed=1):GameState{
 const s:GameState={mode,seed:seed>>>0,score:0,time:0,over:false,won:false,message:'Ready when you are.',board:[],revealed:[],matched:[],selected:[],moves:0,cooldown:0,target:0,level:0,aim:{x:200,y:100},ball:null,blocks:[],snake:[{x:6,y:8},{x:5,y:8},{x:4,y:8}],direction:{x:1,y:0},queued:{x:1,y:0},fruit:{x:10,y:8},accumulator:0,wind:0,lives:3,paddle:200,velocity:150,playerY:420,playerV:0,spawn:1.4,obstacles:[],stars:[],undo:[]};
 if(mode==='merge'){s.board=Array(16).fill(0);tile(s);tile(s);}
 if(mode==='memory')s.board=shuffle(s,[0,1,2,3,4,5,0,1,2,3,4,5]);
 if(mode==='odd')odd(s);
 if(mode==='slide'){s.board=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];let previous=-1;for(let n=0;n<180;n++){const empty=s.board.indexOf(0),near=s.board.map((_,i)=>i).filter(i=>Math.abs(Math.floor(i/4)-Math.floor(empty/4))+Math.abs(i%4-empty%4)===1&&i!==previous);const next=near[integer(s,near.length)];[s.board[empty],s.board[next]]=[s.board[next],s.board[empty]];previous=empty;}if(s.board.every((v,i)=>v===(i+1)%16)){[s.board[14],s.board[15]]=[s.board[15],s.board[14]];}}
 if(mode==='stack'){s.blocks=[{x:120,y:450,w:160,h:26,color:0}];s.paddle=0;}
 if(mode==='toss'){s.target=80+integer(s,240);s.wind=(random(s)-.5)*55;}
 if(mode==='bubbles'){s.board=Array(48).fill(-1);for(let i=0;i<24;i++)s.board[i]=integer(s,3);s.target=integer(s,3);}
 if(mode==='breaker'){for(let y=0;y<4;y++)for(let x=0;x<5;x++)s.blocks.push({x:17+x*75,y:55+y*30,w:66,h:20,color:y});s.ball={x:200,y:420,vx:165,vy:-250};}
 return s;
}
export function collapse(line:number[]){const values=line.filter(Boolean),out:number[]=[];let score=0;for(let i=0;i<values.length;i++){if(values[i]===values[i+1]){out.push(values[i]*2);score+=values[i]*2;i++;}else out.push(values[i]);}while(out.length<4)out.push(0);return {line:out,score};}
export function move2048(s:GameState,type:'left'|'right'|'up'|'down'){
 const before=s.board.slice(),old=s.score;
 for(let row=0;row<4;row++){let indices=Array.from({length:4},(_,col)=>type==='left'||type==='right'?row*4+col:col*4+row);if(type==='right'||type==='down')indices=indices.reverse();const result=collapse(indices.map(i=>s.board[i]));indices.forEach((index,i)=>{s.board[index]=result.line[i];});s.score+=result.score;}
 if(s.board.some((v,i)=>v!==before[i])){s.undo.push({board:before,score:old});if(s.undo.length>20)s.undo.shift();s.moves++;tile(s);s.message=s.board.some(v=>v>=2048)?'2048! Keep going for a bigger tile.':'Keep combining.';}
 if(!s.board.includes(0)&&!s.board.some((v,i)=>(i%4<3&&v===s.board[i+1])||(i<12&&v===s.board[i+4])))finish(s,false,'No moves left. Another round?');
}
export function bubblePosition(i:number):Point{const row=Math.floor(i/6);return {x:40+(i%6)*61+(row%2)*20,y:54+row*46};}
export function attachBubble(s:GameState,ball:Ball){
 const free=s.board.map((v,i)=>v<0?i:-1).filter(i=>i>=0).sort((a,b)=>Math.hypot(bubblePosition(a).x-ball.x,bubblePosition(a).y-ball.y)-Math.hypot(bubblePosition(b).x-ball.x,bubblePosition(b).y-ball.y));const index=free[0];if(index===undefined){finish(s,false,'The sky is full. Try again.');return;}
 s.board[index]=ball.color??0;const cluster=new Set([index]),pending=[index];while(pending.length){const i=pending.pop()!,p=bubblePosition(i);s.board.forEach((v,j)=>{const q=bubblePosition(j);if(v===s.board[index]&&!cluster.has(j)&&Math.hypot(p.x-q.x,p.y-q.y)<65){cluster.add(j);pending.push(j);}});}
 if(cluster.size>=3){cluster.forEach(i=>s.board[i]=-1);s.score+=cluster.size*10;s.message=cluster.size+' bubbles popped!';}else s.message='Find a matching pair to make three.';
 s.ball=null;s.moves++;const colors=[...new Set(s.board.filter(v=>v>=0))];if(!colors.length){finish(s,true,'Clear sky. Nicely done!');return;}s.target=colors[integer(s,colors.length)];if(s.board.some((v,i)=>v>=0&&bubblePosition(i).y>355))finish(s,false,'Bubbles reached the launch zone.');
}
export function inputGame(s:GameState,input:GameInput){
 if(input.type==='undo'&&s.mode==='merge'){const last=s.undo.pop();if(last){s.board=last.board;s.score=last.score;s.over=false;s.won=false;s.message='Move undone.';}return;}
 if(s.over)return;
 const i=input.index??-1;
 if(input.type==='aim'){s.aim={x:Math.max(15,Math.min(385,input.x??200)),y:Math.max(20,Math.min(390,input.y??100))};s.paddle=Math.max(45,Math.min(355,input.x??200));return;}
 if(s.mode==='merge'&&['left','right','up','down'].includes(input.type))move2048(s,input.type as 'left'|'right'|'up'|'down');
 if(s.mode==='slide'){
  const empty=s.board.indexOf(0);let next=i;if(input.type==='left')next=empty%4>0?empty-1:-1;if(input.type==='right')next=empty%4<3?empty+1:-1;if(input.type==='up')next=empty>=4?empty-4:-1;if(input.type==='down')next=empty<12?empty+4:-1;
  if(next>=0&&next<16&&Math.abs(Math.floor(next/4)-Math.floor(empty/4))+Math.abs(next%4-empty%4)===1){[s.board[next],s.board[empty]]=[s.board[empty],s.board[next]];s.moves++;s.score=Math.max(0,1000-s.moves*5);if(s.board.every((v,j)=>v===(j+1)%16))finish(s,true,'Every tile in its place!');}
 }
 if(s.mode==='memory'&&input.type==='cell'&&i>=0&&i<12&&!s.matched.includes(i)&&!s.selected.includes(i)&&s.selected.length<2){s.selected.push(i);if(s.selected.length===2){s.moves++;if(s.board[s.selected[0]]===s.board[s.selected[1]]){s.matched.push(...s.selected);s.selected=[];s.score+=Math.max(5,100-s.moves*2);s.message='A perfect pair!';if(s.matched.length===12)finish(s,true,'Six pairs. Brilliant memory.');}else{s.cooldown=.85;s.message='Remember these two.';}}}
 if(s.mode==='odd'&&input.type==='cell'&&i>=0&&i<16){if(i===s.target){s.score++;s.level++;s.message='Spotted!';odd(s);}else{s.time+=2;s.score=Math.max(0,s.score-1);s.message='Two seconds lost. Look closely.';}}
 if(s.mode==='snake'){const dirs={left:{x:-1,y:0},right:{x:1,y:0},up:{x:0,y:-1},down:{x:0,y:1}};if(input.type in dirs){const d=dirs[input.type as keyof typeof dirs];if(d.x!==-s.direction.x||d.y!==-s.direction.y)s.queued=d;}}
 if(s.mode==='stack'&&input.type==='action'){const top=s.blocks[s.blocks.length-1],x=s.paddle,w=top.w,left=Math.max(x,top.x),right=Math.min(x+w,top.x+w);if(right<=left){finish(s,false,'That one missed. Build another tower!');return;}const perfect=Math.abs(x-top.x)<5;s.blocks.push({x:perfect?top.x:left,y:top.y-26,w:perfect?w:right-left,h:26,color:(s.blocks.length)%5});s.score+=perfect?2:1;s.message=perfect?'Perfect drop! +2':'Nice drop. Keep going.';s.paddle=0;s.velocity=135+Math.min(140,s.blocks.length*8);}
 if(s.mode==='toss'&&input.type==='action'&&!s.ball){s.ball={x:200,y:420,vx:(s.aim.x-200)/1.7,vy:-650};s.message='Here it goes…';}
 if(s.mode==='bubbles'&&input.type==='action'&&!s.ball){const angle=Math.atan2(s.aim.y-455,s.aim.x-200),a=Math.max(-Math.PI+.2,Math.min(-.2,angle));s.ball={x:200,y:455,vx:Math.cos(a)*420,vy:Math.sin(a)*420,color:s.target};}
 if(s.mode==='breaker'&&(input.type==='left'||input.type==='right'))s.paddle=Math.max(45,Math.min(355,s.paddle+(input.type==='left'?-32:32)));
 if(s.mode==='runner'&&(input.type==='action'||input.type==='up')&&s.playerY>=419){s.playerV=-460;s.message='Up and over!';}
}
export function tickGame(s:GameState,dt:number){
 if(s.over)return;dt=Math.max(0,Math.min(.05,dt));s.time+=dt;
 if(s.mode==='memory'&&s.cooldown>0){s.cooldown-=dt;if(s.cooldown<=0)s.selected=[];}
 if(s.mode==='odd'&&s.time>=60)finish(s,true,'Time! You spotted '+s.score+' odd ones.');
 if(s.mode==='stack'){const w=s.blocks[s.blocks.length-1].w;s.paddle+=s.velocity*dt;if(s.paddle<0||s.paddle+w>400){s.paddle=Math.max(0,Math.min(400-w,s.paddle));s.velocity=-s.velocity;}}
 if(s.mode==='snake'){s.accumulator+=dt;const speed=Math.max(.075,.17-s.score*.004);if(s.accumulator>=speed){s.accumulator-=speed;s.direction=s.queued;const head={x:s.snake[0].x+s.direction.x,y:s.snake[0].y+s.direction.y},eat=head.x===s.fruit.x&&head.y===s.fruit.y,body=eat?s.snake:s.snake.slice(0,-1);if(head.x<0||head.x>=16||head.y<0||head.y>=16||body.some(p=>p.x===head.x&&p.y===head.y)){finish(s,false,'A little too close. Try another run.');return;}s.snake.unshift(head);if(eat){s.score++;fruit(s);}else s.snake.pop();}}
 if(s.mode==='toss'&&s.ball){const b=s.ball,previousY=b.y;b.vx+=s.wind*dt;b.vy+=600*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.vy>0&&previousY<=160&&b.y>=160){s.moves++;const hit=Math.abs(b.x-s.target)<28;if(hit){s.score++;s.message='In the bin!';}else{s.message='Close! Adjust your aim.';}s.ball=null;if(s.moves>=10){finish(s,true,s.score+' baskets in ten throws.');return;}s.target=80+integer(s,240);s.wind=(random(s)-.5)*55;}else if(b.y>500||b.x<-80||b.x>480){s.moves++;s.ball=null;s.message='Missed. Try a smaller adjustment.';if(s.moves>=10)finish(s,true,s.score+' baskets in ten throws.');}}
 if(s.mode==='bubbles'&&s.ball){const b=s.ball;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<22||b.x>378){b.x=Math.max(22,Math.min(378,b.x));b.vx=-b.vx;}if(b.y<=35||s.board.some((v,i)=>{const p=bubblePosition(i);return v>=0&&Math.hypot(p.x-b.x,p.y-b.y)<43;}))attachBubble(s,b);}
 if(s.mode==='breaker'&&s.ball){const b=s.ball;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<8||b.x>392){b.x=Math.max(8,Math.min(392,b.x));b.vx=-b.vx;}if(b.y<25){b.y=25;b.vy=Math.abs(b.vy);}if(b.vy>0&&b.y>=445&&b.y<=475&&Math.abs(b.x-s.paddle)<50){b.y=444;b.vy=-Math.abs(b.vy);b.vx=(b.x-s.paddle)*6;}
 const hit=s.blocks.findIndex(r=>b.x>=r.x-7&&b.x<=r.x+r.w+7&&b.y>=r.y-7&&b.y<=r.y+r.h+7);if(hit>=0){s.blocks.splice(hit,1);b.vy=-b.vy;s.score+=10;if(!s.blocks.length){finish(s,true,'Every brick gone. Beautiful!');return;}}
 if(b.y>510){s.lives--;if(!s.lives){finish(s,false,'Out of lives. One more bounce?');return;}s.ball={x:s.paddle,y:420,vx:140,vy:-250};s.message=s.lives+' lives left.';}}
 if(s.mode==='runner'){s.playerV+=1100*dt;s.playerY=Math.min(420,s.playerY+s.playerV*dt);if(s.playerY>=420)s.playerV=0;s.spawn-=dt;const speed=180+Math.min(140,s.time*2);if(s.spawn<=0){s.obstacles.push({x:430,y:420});s.stars.push({x:500,y:325});s.spawn=1.2+random(s)*.7;}for(const p of [...s.obstacles,...s.stars])p.x-=speed*dt;s.obstacles=s.obstacles.filter(p=>p.x>-40);s.stars=s.stars.filter(p=>{if(Math.abs(p.x-75)<25&&Math.abs(p.y-(s.playerY+15))<33){s.level+=20;return false;}return p.x>-30;});s.score=Math.floor(s.time*10)+s.level;if(s.obstacles.some(p=>p.x<95&&p.x+24>60&&s.playerY+30>p.y))finish(s,false,'Good run! Jump a little earlier next time.');}
}
export function restoreBoard(mode:GameMode,value:unknown,seed:number):GameState|null{
 if(!value||typeof value!=='object'||!('board' in value)||!Array.isArray(value.board))return null;
 const v=value as {board:unknown[];score?:unknown;moves?:unknown};if(v.board.length!==16||!v.board.every(n=>typeof n==='number'&&Number.isSafeInteger(n)&&n>=0))return null;
 const board=v.board as number[];if(mode==='slide'&&(new Set(board).size!==16||board.some(n=>n>15)))return null;
 if(mode==='merge'&&board.some(n=>n!==0&&(n<2||n>1048576||!Number.isInteger(Math.log2(n)))))return null;
 if(mode!=='slide'&&mode!=='merge')return null;const s=createGame(mode,seed);s.board=board.slice();s.score=typeof v.score==='number'&&Number.isFinite(v.score)?Math.max(0,v.score):0;s.moves=typeof v.moves==='number'&&Number.isFinite(v.moves)?Math.max(0,v.moves):0;s.message='Saved board restored. Resume when ready.';return s;
}
