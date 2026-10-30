/**
 * The owner requested permanent removal of these exported invalid/retired URLs.
 * Keep this exact list separate from unknown URLs (404) and recovered URLs (308).
 */
export const permanentlyRemovedPaths = [
 '/lab/arcade/buddy-pachisi:x21xsx',
 '/lab/arcade/bullseye-301:1e9b8bv',
 '/lab/arcade/letter-dice:14ycfql',
 '/lab/arcade/word-duel:11qo4hy',
 '/lab/arcade/quiet-words:13d888f',
 '/lab/arcade/word-path:ps55wt',
 '/lab/arcade/word-postcards:1k21wce',
 '/lab/arcade/disc-drop-plinko:1nd6kra',
 '/lab/arcade/pocket-puzzle-mix:8elmm5',
 '/lab/arcade/letter-solitaire:603xnk',
 '/lab/arcade/crossword-garden:zf253y',
 '/lab/arcade/secret-quote:lnhaxp',
 '/lab/arcade/buddy-burrows:1mem2pz',
 '/lab/arcade/category-cards:1wivv72',
 '/lab/arcade/orbit-words:1kxw5do',
 '/lab/arcade/crossword-sprint:1ii55kp',
 '/lab/arcade/crossword-atlas:3ll5co',
 '/lab/arcade/clue-hunt:1mrcbgm',
 '/examples/verified-tools/þÿ',
 '/test-fixtures/þÿ',
] as const;

// Their normal retired-game addresses are also permanently unavailable.
const removed=new Set<string>([
 ...permanentlyRemovedPaths,
 ...permanentlyRemovedPaths.filter(path=>path.startsWith('/lab/arcade/')).map(path=>path.slice(0,path.lastIndexOf(':'))),
]);

export function isPermanentlyRemovedPath(path:string):boolean{
 try{return removed.has(decodeURIComponent(path).replace(/\/+$/,''));}
 catch{return false;}
}

const removedHtml='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><meta name="description" content="This PDF Studio address has been permanently removed and has no replacement."><title>Page permanently removed | PDF Studio</title></head><body><main><h1>Page permanently removed</h1><p>This address is permanently unavailable and has no replacement.</p><p><a href="/">Visit PDF Studio</a></p></main></body></html>';

export function permanentlyRemovedResponse(request:Request):Response|null{
 if(!['GET','HEAD'].includes(request.method)||!isPermanentlyRemovedPath(new URL(request.url).pathname))return null;
 return new Response(request.method==='HEAD'?null:removedHtml,{
  status:410,statusText:'Gone',
  headers:{
   'Content-Type':'text/html; charset=utf-8',
   'X-Robots-Tag':'noindex, follow',
   'Cache-Control':'public, max-age=3600',
  },
 });
}
