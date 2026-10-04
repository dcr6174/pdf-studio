/** Small helpers for the welcome area. Everything uses the visitor's own device clock. */
export type PartOfDay='morning'|'day'|'evening'|'night';
export type Light='moon'|'morning'|'day'|'evening';

/** morning 05:00-10:59, day 11:00-16:59, evening 17:00-20:59, night 21:00-04:59 */
export function partOfDay(d:Date):PartOfDay{
 const h=d.getHours();
 if(h>=5&&h<11)return 'morning';
 if(h>=11&&h<17)return 'day';
 if(h>=17&&h<21)return 'evening';
 return 'night';
}
export function greetingFor(d:Date){
 const h=d.getHours();
 if(h>=5&&h<12)return 'Good morning.';
 if(h>=12&&h<17)return 'Good afternoon.';
 return 'Good evening.';
}
export const GREETING_TAIL='Let’s make something easier.';

/** The chosen theme always wins: dark means moonlight, whatever the hour. In light, the hour sets the lighting. */
export function lightFor(theme:'light'|'dark',part:PartOfDay):Light{
 if(theme==='dark')return 'moon';
 return part==='morning'?'morning':part==='day'?'day':'evening';
}

/** Short and steady. One per calendar day (see dailyLine); never rotates while someone is reading. */
export const dailyLines=[
 'Small steps still move you forward.',
 'Your next chapter starts with what you do today.',
 'Progress doesn’t need to be perfect.',
 'One tidy file at a time.',
 'Done is a good place to begin.',
 'You’re closer than you think.',
 'Take it one page at a time.',
 'A little order goes a long way.',
 'Clear the clutter, keep the momentum.',
 'Finish this, then take a breath.',
 'Steady work adds up.',
 'Today’s small win counts.',
];
/** Whole days since 1970 for the visitor's LOCAL calendar date. */
export function dayNumber(d:Date){return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);}
export function dailyLine(d:Date){return dailyLines[((dayNumber(d)%dailyLines.length)+dailyLines.length)%dailyLines.length];}

/** Show seconds in the clock? Off by default: a clock that changes every second is a distraction while people work.
 *  Set to true for a ticking clock (the seconds digits roll like the minutes). */
export const SHOW_SECONDS=false;

/** Milliseconds until the next whole minute (or second, when SHOW_SECONDS is on). Never a fixed interval, so it stays on the beat. */
export function msToNextMinute(d:Date){return (60-d.getSeconds())*1000-d.getMilliseconds();}
export function msToNextTick(d:Date,seconds=SHOW_SECONDS){return seconds?1000-d.getMilliseconds():msToNextMinute(d);}

export function formatClock(d:Date,locale?:string,seconds=SHOW_SECONDS){
 return {
  // latin digits so each digit can roll on its own, whatever the visitor's language
  time:new Intl.DateTimeFormat(locale,{hour:'numeric',minute:'2-digit',...(seconds?{second:'2-digit'}:{}),numberingSystem:'latn'}).format(d),
  date:new Intl.DateTimeFormat(locale,{weekday:'long',day:'numeric',month:'long'}).format(d),
 };
}
