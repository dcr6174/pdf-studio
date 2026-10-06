/** CSS clockwise angle mapped to PDF coordinates around the same box center. */
export function markRotation(angle:number,x:number,y:number,w:number,h:number):[number,number,number,number,number,number]{
 if(!Number.isFinite(angle))throw new Error('Choose a valid element angle.');
 const radians=-angle*Math.PI/180,c=Math.cos(radians),s=Math.sin(radians),cx=x+w/2,cy=y+h/2;
 return [c,s,-s,c,cx-c*cx+s*cy,cy-s*cx-c*cy];
}
