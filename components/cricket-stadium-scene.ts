import * as THREE from 'three';
import {cricketFielders} from '@/lib/cricket-engine';
import {cricketBallWorld,cricketFieldWorld,cricketShotWorld} from '@/lib/cricket-presentation';
import type {CricketSceneState} from './cricket-stadium';

/** Original procedural artwork: no remote models, textures, fonts or licensed team assets. */
export function createCricketScene(canvas:HTMLCanvasElement,read:()=>CricketSceneState,onFailure:()=>void){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,read().quality==='high'?2:1));
 renderer.shadowMap.enabled=read().quality==='high';renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.25;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#071426');scene.fog=new THREE.Fog('#071426',65,145);
 const camera=new THREE.PerspectiveCamera(49,1,.1,180);
 const home=new THREE.Vector3(0,5.3,-18.7),look=new THREE.Vector3(0,1,7);
 camera.position.copy(home);camera.lookAt(look);
 const ambient=new THREE.HemisphereLight('#c3dcff','#18351c',1.9);scene.add(ambient);
 const sun=new THREE.DirectionalLight('#e9f4ff',3.5);sun.position.set(-16,30,-14);
 sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 Object.assign(sun.shadow.camera,{left:-18,right:18,top:23,bottom:-18,near:1,far:85});
 sun.shadow.normalBias=.04;scene.add(sun);sun.target.position.set(0,0,2);scene.add(sun.target);
 const materials:THREE.Material[]=[],geometries:THREE.BufferGeometry[]=[];
 const mat=(color:string,roughness=.85)=>{const m=new THREE.MeshStandardMaterial({color,roughness});materials.push(m);return m;};
 const grass=mat('#388e57'),stripe=mat('#429b5b'),sand=mat('#d6b982'),white=mat('#f5f0d9');
 const navy=mat('#12394e'),mint=mat('#95e2bb'),skin=mat('#c98d66'),kit=mat('#f6eedb'),pad=mat('#dfeae5'),batMat=mat('#e4bd76');
 const crowdColors=['#f7cc81','#72b4b1','#a6c3df','#d8877c'].map(c=>mat(c));
 const box=(x:number,y:number,z:number)=>{const g=new THREE.BoxGeometry(x,y,z);geometries.push(g);return g;};
 const sphere=(r:number)=>{const g=new THREE.SphereGeometry(r,12,8);geometries.push(g);return g;};
 const cylinder=(r1:number,r2:number,h:number)=>{const g=new THREE.CylinderGeometry(r1,r2,h,12);geometries.push(g);return g;};
 const mesh=(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D,x=0,y=0,z=0)=>{
  const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;
 };
 // Original floodlight towers keep the night setting recognizable without remote assets.
 const lamp=new THREE.MeshBasicMaterial({color:'#e6f1ff'});materials.push(lamp);
 for(const x of [-28,28])for(const z of [-12,32]){
  mesh(cylinder(.22,.35,15),navy,scene,x,7.5,z);
  mesh(box(5,.9,.6),lamp,scene,x,15,z);
  for(let i=-1;i<=1;i++)mesh(box(1.2,.7,.2),white,scene,x+i*1.5,15,z-.35);
 }
 // Elliptical outfield, subtle mowing bands, and a full-length pitch.
 const groundGeo=new THREE.CircleGeometry(1,80);geometries.push(groundGeo);
 const field=mesh(groundGeo,grass,scene,0,-.04,5);field.rotation.x=-Math.PI/2;field.scale.set(39,36,1);field.receiveShadow=true;
 for(let i=0;i<9;i++){
  const z=-23+i*7,half=36*Math.sqrt(Math.max(0,1-Math.pow((z-5)/35,2)));
  const band=mesh(box(half*2,.015,3.5),stripe,scene,0,-.025,z);band.receiveShadow=true;
 }
 const pitch=mesh(box(2.7,.07,24.7),sand,scene,0,.025,0);pitch.receiveShadow=true;
 for(const z of [-9.7,9.7]){
  mesh(box(3.7,.018,.065),white,scene,0,.07,z);
  for(const x of [-1.15,1.15])mesh(box(.05,.02,1.6),white,scene,x,.07,z+.2);
 }
 const ropePoints=Array.from({length:97},(_,i)=>new THREE.Vector3(Math.cos(i/96*Math.PI*2)*32,.08,5+Math.sin(i/96*Math.PI*2)*30));
 const ropeGeo=new THREE.BufferGeometry().setFromPoints(ropePoints);geometries.push(ropeGeo);
 const ropeMat=new THREE.LineBasicMaterial({color:'#fff4d4'});materials.push(ropeMat);scene.add(new THREE.Line(ropeGeo,ropeMat));
 // Stadium tiers are instanced: hundreds of seats cost only a handful of draw calls.
 const standMat=mat('#26475c'),seatGeo=box(1.1,.55,.85),standGeo=box(5,1.1,4);
 const count=48*4,stands=new THREE.InstancedMesh(standGeo,standMat,count);
 const dummy=new THREE.Object3D();
 let n=0;
 for(let row=0;row<4;row++)for(let i=0;i<48;i++){
  const a=i/48*Math.PI*2,r=40+row*3;
  dummy.position.set(Math.cos(a)*r,1+row*1.35,5+Math.sin(a)*(r-.5));dummy.rotation.set(0,-a,0);dummy.updateMatrix();stands.setMatrixAt(n++,dummy.matrix);
 }
 stands.instanceMatrix.needsUpdate=true;scene.add(stands);
 const crowdMeshes=crowdColors.map(m=>new THREE.InstancedMesh(seatGeo,m,144));
 crowdMeshes.forEach(o=>scene.add(o));
 for(let c=0;c<4;c++)for(let i=0;i<144;i++){
  const row=Math.floor(i/48),a=(i%48+c*.23)/48*Math.PI*2,r=41+row*3;
  dummy.position.set(Math.cos(a)*r,2.1+row*1.35,5+Math.sin(a)*(r-.5));dummy.rotation.set(0,-a,0);dummy.updateMatrix();crowdMeshes[c].setMatrixAt(i,dummy.matrix);
 }
 for(const x of [-30,30])for(const z of [-21,33]){
  mesh(cylinder(.18,.28,17),navy,scene,x,8.5,z);
  const lamp=mesh(box(5,1.5,.4),white,scene,x,17,z);lamp.rotation.y=x<0?.5:-.5;
 }
 white.emissive.set('#a9d5ff');white.emissiveIntensity=.18;
 const boards=mat('#173748');
 for(let i=0;i<32;i++){
  const a=i/32*Math.PI*2;
  const board=mesh(box(5,1.1,.35),i%4===0?mint:boards,scene,Math.cos(a)*35,.6,5+Math.sin(a)*33);board.rotation.y=-a+Math.PI/2;
 }
 // Articulated low-poly character rigs. Shoulder, hip and bat pivots animate independently.
 const bodyGeo=box(.68,.85,.35),headGeo=sphere(.23),limbGeo=cylinder(.105,.1,.62),bootGeo=box(.2,.15,.37);
 function player(x:number,z:number,color:THREE.Material,scale=1){
  const root=new THREE.Group();root.position.set(x,0,z);root.scale.setScalar(scale);scene.add(root);
  const torso=new THREE.Group();torso.position.y=1.05;root.add(torso);
  mesh(bodyGeo,color,torso,0,.27,0);mesh(headGeo,skin,torso,0,.99,0);
  mesh(cylinder(.245,.25,.15),navy,torso,0,1.12,0);
  const arms=[-1,1].map(side=>{const pivot=new THREE.Group();pivot.position.set(side*.39,.61,0);torso.add(pivot);mesh(limbGeo,color,pivot,0,-.24,0);mesh(sphere(.105),skin,pivot,0,-.58,0);return pivot;});
  const legs=[-1,1].map(side=>{const pivot=new THREE.Group();pivot.position.set(side*.19,.95,0);root.add(pivot);mesh(limbGeo,color,pivot,0,-.29,0);mesh(bootGeo,white,pivot,0,-.84,-.05);return pivot;});
  root.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});
  return{root,torso,arms,legs};
 }
 const batter=player(-.42,-10.4,kit);batter.root.rotation.y=-.25;
 for(let i=0;i<2;i++)mesh(box(.23,.51,.14),pad,batter.legs[i],0,-.46,-.12);
 const batPivot=new THREE.Group();batPivot.position.set(.35,1.2,-.12);batter.root.add(batPivot);
 const blade=mesh(box(.2,.72,.08),batMat,batPivot,0,-.47,0);blade.castShadow=true;
 mesh(cylinder(.033,.033,.28),navy,batPivot,0,.02,0);
 const bowler=player(0,10.8,navy,.95);bowler.root.rotation.y=Math.PI;
 const keeper=player(0,-12.3,mint,.9);keeper.root.rotation.y=0;
 const fielders=cricketFielders.map(f=>{const p=cricketFieldWorld(f.x,f.y);const person=player(p.x,p.z,navy,.95);person.root.lookAt(0,0,-10);return person;});
 const bails:THREE.Mesh[]=[];
 for(const z of [-11.1,10.6]){
  for(const x of [-.22,0,.22]){const stump=mesh(cylinder(.035,.035,.85),white,scene,x,.43,z);stump.castShadow=true;}
  for(const x of [-.11,.11])bails.push(mesh(box(.25,.04,.05),white,scene,x,.89,z));
 }
 const ballMesh=mesh(sphere(.12),mat('#fff8de',.4),scene);ballMesh.castShadow=true;
 const seam=mesh(new THREE.TorusGeometry(.121,.008,4,20),mat('#dc544c'),ballMesh);geometries.push(seam.geometry);
 const shadowMaterial=new THREE.MeshBasicMaterial({color:'#112a20',transparent:true,opacity:.22,depthWrite:false});materials.push(shadowMaterial);
 const shadow=mesh(new THREE.CircleGeometry(.2,16),shadowMaterial,scene);geometries.push(shadow.geometry);shadow.rotation.x=-Math.PI/2;
 const bounceMaterial=new THREE.MeshBasicMaterial({color:'#ffdf8c',transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false});materials.push(bounceMaterial);
 const bounce=mesh(new THREE.RingGeometry(.32,.37,40),bounceMaterial,scene);geometries.push(bounce.geometry);bounce.rotation.x=-Math.PI/2;
 const trailMat=new THREE.MeshBasicMaterial({color:'#ffecad',transparent:true,opacity:.5,depthWrite:false});materials.push(trailMat);
 const trail=Array.from({length:9},()=>mesh(sphere(.055),trailMat,scene));
 const sparkMat=new THREE.MeshBasicMaterial({color:'#ffe6a4'});materials.push(sparkMat);
 const sparks=Array.from({length:12},()=>mesh(box(.07,.07,.07),sparkMat,scene));
 const baseBails=bails.map(o=>o.position.clone());
 let frame=0,last=0,lastPhase='',lastStroke=-1,resultTime=0,disposed=false,lastActive=true;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const resize=()=>{const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.fov=camera.aspect<.85?59:49;camera.updateProjectionMatrix();};
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
 const fail=(e:Event)=>{e.preventDefault();onFailure();};canvas.addEventListener('webglcontextlost',fail);
 const toVector=(p:{x:number;y:number;z:number})=>new THREE.Vector3(p.x,p.y,p.z);
 const loop=(now:number)=>{
  if(disposed)return;frame=requestAnimationFrame(loop);
  const state=read(),dt=last?Math.min((now-last)/1000,.05):0;last=now;
  kit.color.set(state.teamColor??'#b6ed40');mint.color.set(state.opponentColor??'#ffb56e');
  const draw=state.active||lastActive||lastPhase!==state.phase;lastActive=state.active;
  if(!draw)return;
  const hasResult=(state.phase==='result'||state.phase==='done')&&state.result;
  if(lastStroke!==state.strokeFlash||lastPhase!==state.phase){if(hasResult)resultTime=0;lastStroke=state.strokeFlash;lastPhase=state.phase;}
  if(hasResult&&state.active)resultTime+=dt;
  const quiet=reduced.matches||state.comfort;
  const t=state.elapsed/state.ball.contactMs;
  const point=hasResult?cricketShotWorld(state.ball,state.result!,Math.min(1,resultTime/.95)):cricketBallWorld(state.ball,state.elapsed);
  ballMesh.visible=state.phase!=='setup';shadow.visible=ballMesh.visible;ballMesh.position.copy(toVector(point));ballMesh.rotation.x=t*18;
  shadow.position.set(point.x,.09,point.z);shadow.scale.setScalar(1+point.y*.08);shadowMaterial.opacity=.28/(1+point.y*.18);
  const bouncePoint=cricketBallWorld(state.ball,state.ball.contactMs*state.ball.bounce);bounce.position.set(bouncePoint.x,.09,bouncePoint.z);bounce.visible=state.phase==='bowling';
  bounce.scale.setScalar(quiet?1:1+Math.sin(t*8)*.08);
  for(let i=0;i<trail.length;i++){
   trail[i].visible=state.phase==='bowling'||!!hasResult&&state.result!.runs>0;
   const p=hasResult?cricketShotWorld(state.ball,state.result!,Math.max(0,(resultTime-i*.017)/.95)):cricketBallWorld(state.ball,Math.max(0,state.elapsed-i*12));
   trail[i].position.set(p.x,p.y,p.z);trail[i].scale.setScalar((trail.length-i)/trail.length);
  }
  // Bowling release/run-up derives from delivery time, so pause and slow mode stay aligned.
  bowler.root.position.z=10.8+Math.max(0,1-t/.18)*3;
  bowler.arms[0].rotation.x=t<.2?-Math.PI*t/.2:0;bowler.legs[0].rotation.x=t<.18?Math.sin(t*100)*.5:0;bowler.legs[1].rotation.x=-bowler.legs[0].rotation.x;
  const swing=hasResult?Math.min(1,resultTime/.28):0;
  const direction=state.shotDirection==='leg'?-1:state.shotDirection==='off'?1:0;
  batter.torso.rotation.y=hasResult?Math.sin(swing*Math.PI/2)*(.8+direction*.35):-.08;
  batPivot.rotation.set(hasResult?-1.2+Math.sin(swing*Math.PI/2)*2.5:-.25,hasResult?direction*swing:0,hasResult?-.9+swing*1.4:-.45);
  batter.arms[0].rotation.x=hasResult?-.8-swing*.5:-.45;batter.arms[1].rotation.x=hasResult?-.9-swing*.5:-.6;
  const target=hasResult&&state.result!.interceptedBy?cricketFielders.findIndex(f=>f.name===state.result!.interceptedBy):-1;
  fielders.forEach((f,i)=>{const p=cricketFieldWorld(cricketFielders[i].x,cricketFielders[i].y);const reach=hasResult&&i===target?Math.min(1,resultTime/.8):0;f.root.position.set(p.x+(point.x-p.x)*reach,0,p.z+(point.z-p.z)*reach);f.arms[0].rotation.x=reach?-.9:0;});
  bails.forEach((b,i)=>{b.position.copy(baseBails[i]);b.rotation.z=0;if(i<2&&hasResult&&state.result!.out==='bowled'){b.position.x+=(i?1:-1)*Math.min(1,resultTime)*1.5;b.position.y+=Math.sin(Math.min(1,resultTime)*Math.PI)*1.6;b.rotation.z=resultTime*8;}});
  sparks.forEach((s,i)=>{s.visible=!!hasResult&&state.result!.runs>=4&&resultTime<.65&&!quiet;const a=i/12*Math.PI*2;s.position.set(point.x+Math.cos(a)*resultTime*2,point.y+Math.sin(a)*resultTime*2,point.z);});
  // Follow only boundary flights; never move the camera while the player is timing a ball.
  const follow=!!hasResult&&state.result!.runs>=4&&!quiet;
  const eye=follow?new THREE.Vector3(point.x*.2,6+Math.min(point.y,7)*.25,-18.7+Math.min(resultTime,.8)*3):home;
  camera.position.lerp(eye,1-Math.exp(-dt*7));
  const aim=follow?new THREE.Vector3(point.x*.52,Math.max(1,point.y*.6),Math.max(7,point.z*.5)):look;
  camera.lookAt(aim);renderer.render(scene,camera);
 };
 frame=requestAnimationFrame(loop);
 return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('webglcontextlost',fail);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());stands.dispose();crowdMeshes.forEach(o=>o.dispose());renderer.dispose();};
}
