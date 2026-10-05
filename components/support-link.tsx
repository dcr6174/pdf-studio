import {Coffee} from 'lucide-react';
export function SupportLink({success=false}:{success?:boolean}){
 return <a className="support-link" href="https://buymeacoffee.com/dcr6174" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee, optional support, opens in a new tab"><Coffee size={18} aria-hidden="true"/><span>{success?'Happy with the result? Buy me a coffee':'Buy me a coffee'}</span></a>;
}
