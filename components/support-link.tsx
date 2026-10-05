import {HeartHandshake} from 'lucide-react';
export function SupportLink({success=false}:{success?:boolean}){
 const label=success?'Donate — optional support after your result':'Donate — optional support';
 const link=<a className={`support-link${success?' support-link-success':''}`} href="https://buymeacoffee.com/dcr6174" target="_blank" rel="noopener noreferrer" aria-label={label+', opens in a new tab'} title={label}><HeartHandshake size={20} aria-hidden="true"/>{success&&<span>Donate</span>}</a>;
 return success?<div className="support-message"><p>Happy with your result? Help keep PDF Studio free.</p>{link}</div>:link;
}
