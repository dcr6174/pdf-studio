import {HeartHandshake} from 'lucide-react';
export function SupportLink({success=false}:{success?:boolean}){
 const label=success?'Donate — optional support after your result':'Donate — optional support';
 return <a className="support-link" href="https://buymeacoffee.com/dcr6174" target="_blank" rel="noopener noreferrer" aria-label={label+', opens in a new tab'} title={label} style={{minWidth:44,justifyContent:'center'}}><HeartHandshake size={20} aria-hidden="true"/></a>;
}
