import {SiteHeader,SiteFooter} from '@/components/site-header';
import {TestFileLibrary} from '@/components/test-file-library';

export const metadata={title:'PDF Studio test files',robots:{index:false,follow:false}};
export default function TestFiles(){return <><SiteHeader/><TestFileLibrary/><SiteFooter/></>;}
