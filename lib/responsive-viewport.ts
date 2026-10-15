export type ViewportInput={width:number;height:number;visibleWidth?:number;visibleHeight?:number;offsetTop?:number;scale?:number;editing:boolean};
/** Geometry only: no user-agent or device-model detection. Pinch zoom is not a keyboard. */
export function responsiveViewport(input:ViewportInput){
 const positive=(value:number|undefined,fallback:number)=>typeof value==='number'&&Number.isFinite(value)&&value>0?value:fallback;
 const width=positive(input.visibleWidth,positive(input.width,320)),height=positive(input.visibleHeight,positive(input.height,640));
 const top=typeof input.offsetTop==='number'&&Number.isFinite(input.offsetTop)?Math.max(0,input.offsetTop):0;
 const scale=positive(input.scale,1);
 const zoomed=Math.abs(scale-1)>=.05;
 return {width:Math.round(zoomed?positive(input.width,width):width),height:Math.round(zoomed?positive(input.height,height):height),top:zoomed?0:Math.round(top),keyboard:input.editing&&!zoomed&&input.height-height>150};
}
