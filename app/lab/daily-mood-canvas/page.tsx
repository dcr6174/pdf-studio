import {DailyMoodCanvas} from '@/components/daily-mood-canvas';
import {pageMeta} from '@/lib/page-meta';

export const metadata=pageMeta('/lab/daily-mood-canvas','Daily mood canvas — Studio Lab','A playful daily scratchpad: sketch freely, stamp your mood and spark a fresh idea.');

export default function DailyMoodCanvasPage(){return <DailyMoodCanvas/>;}
