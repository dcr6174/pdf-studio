import type {ReactNode} from 'react';
import {SiteHeader,SiteFooter} from '@/components/site-header';
/** Shared full-width chrome; individual pages constrain only their content. */
export function SiteFrame({children,tool='PDF Studio'}:{children:ReactNode;tool?:string}){
 return <div className="site-frame"><SiteHeader/>{children}<SiteFooter tool={tool}/></div>;
}
