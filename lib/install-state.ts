export const INSTALL_KEY='pdf-studio-installed';
export const INSTALL_CHANGED='pdf-studio-install-changed';
export type RelatedApp={platform?:string;url?:string;id?:string};
export function isStudioInstalled(apps:RelatedApp[],origin:string){return apps.some(app=>{if(app.platform!=='webapp')return false;try{return app.url?new URL(app.url,origin).href===new URL('/manifest.webmanifest',origin).href:new URL(app.id??'',origin).href===new URL('/',origin).href&&Boolean(app.id);}catch{return false;}});}
export function rememberedInstall(storage:Pick<Storage,'getItem'>){try{return storage.getItem(INSTALL_KEY)==='yes';}catch{return false;}}
export function rememberInstall(storage:Pick<Storage,'setItem'|'removeItem'>,installed:boolean){try{installed?storage.setItem(INSTALL_KEY,'yes'):storage.removeItem(INSTALL_KEY);}catch{/* Browser storage is optional. */}}
