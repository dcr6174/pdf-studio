import type {ImgHTMLAttributes} from 'react';

type Props=Omit<ImgHTMLAttributes<HTMLImageElement>,'src'|'alt'>&{src:string;alt:string;fill?:boolean;unoptimized?:boolean};
/** Browser-local images must never be sent to a server-side image optimizer.
 * Width/height reserve logo space; previews decode lazily within fixed holders. */
export default function BrowserImage({alt,fill=false,unoptimized=true,style,loading,decoding='async',...props}:Props){
 // The compatibility flag deliberately selects browser decoding for every image.
 if(!unoptimized)throw new Error('Server image optimization is not available in PDF Studio.');
 const preview=props.src.startsWith('data:')||props.src.startsWith('blob:');
 return <img {...props} alt={alt} loading={loading??(preview?'lazy':'eager')} decoding={decoding} style={fill?{position:'absolute',inset:0,width:'100%',height:'100%',...style}:style}/>;
}
