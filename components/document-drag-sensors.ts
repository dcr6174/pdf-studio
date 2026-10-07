import {MouseSensor,TouchSensor} from '@dnd-kit/core';
function interactive(target:EventTarget|null){
 if(!(target instanceof Element))return false;
 if(target.closest('.merge-drag-handle,.page-drag-handle'))return false;
 const control=target.closest('button,a,input,select,textarea,summary');
 return !!control&&!control.classList.contains('page-preview');
}
export class CardMouseSensor extends MouseSensor{
 static activators=MouseSensor.activators.map(a=>({...a,handler:(...args:Parameters<typeof a.handler>)=>!interactive(args[0].nativeEvent.target)&&a.handler(...args)}));
}
export class CardTouchSensor extends TouchSensor{
 static activators=TouchSensor.activators.map(a=>({...a,handler:(...args:Parameters<typeof a.handler>)=>!interactive(args[0].nativeEvent.target)&&a.handler(...args)}));
}

