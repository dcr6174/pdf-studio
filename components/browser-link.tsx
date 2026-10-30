import type {AnchorHTMLAttributes} from 'react';
import {canonicalPublicPath} from '@/lib/canonical-routes';

/** Native navigation avoids the deployed vinext RSC Link runtime failure.
 * Same-document workspace handlers can still preventDefault; page changes
 * use browser navigation, including beforeunload protection and new tabs.
 */
export default function BrowserLink(props:AnchorHTMLAttributes<HTMLAnchorElement>){
  let href=props.href;
  if(href?.startsWith('/')&&!href.startsWith('//')){
    const url=new URL(href,'https://pdf-studio.in');
    href=canonicalPublicPath(url.pathname)+url.search+url.hash;
  }
  return <a {...props} href={href}/>;
}
