import {SiteHeader,SiteFooter} from '@/components/site-header';
import {WatermarkStudio} from '@/components/watermark-studio';
import {pageMeta} from '@/lib/page-meta';

export const metadata=pageMeta('/lab/remove-watermark','Remove Watermark — Lab | PDF Studio','Remove separate text and image watermarks from PDFs on your device. Select objects, compare before and after, and download an edited copy.');
export default function RemoveWatermarkPage(){return <><SiteHeader/><WatermarkStudio/><SiteFooter tool="Remove Watermark"/></>;}
