import type {AnchorHTMLAttributes} from 'react';

/** Native navigation avoids the deployed vinext RSC Link runtime failure.
 * Same-document workspace handlers can still preventDefault; page changes
 * use browser navigation, including beforeunload protection and new tabs.
 */
export default function BrowserLink(props:AnchorHTMLAttributes<HTMLAnchorElement>){
  return <a {...props}/>;
}
