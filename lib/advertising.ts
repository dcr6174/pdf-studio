import {imageTools} from './image-tools';
// Change true to false, commit and redeploy to remove ads everywhere.
export const ADS_ENABLED = true;
export const AD_CLIENT = 'ca-pub-1116637142188934';
export const AD_SLOT = '7345764201';
export function isAdvertisingPage(path:string){
 if(imageTools.some(tool=>path.replace(/\/$/,'')==='/lab/'+tool.slug))return false;
 return !/^\/(?:analytics|api|privacy|terms)(?:\/|$)/.test(path);
}
