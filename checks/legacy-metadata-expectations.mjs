// Independent expected destinations for aliases present in the GSC export.
const canonicalAliases={
 '/lab/sketch-pdf':'/tools/sketch-over-pdf',
 '/tools/resize-to-a4':'/tools/resize-pages',
 '/guides/resize-to-a4':'/guides/resize-pages',
};
export const legacyMetadataTarget=path=>{
 const clean=path.slice(0,path.lastIndexOf(':'));
 return canonicalAliases[clean]??clean;
};

// All 20 exported addresses deliberately excluded from the redirect repair.
export const protected404Paths=[
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
 '/examples/verified-tools/%C3%BE%C3%BF',
 '/test-fixtures/%C3%BE%C3%BF',
];

export const unapprovedMetadataPaths=[
 '/lab/pomodoro:unapproved',
 '/tools/not-a-real-tool:1ql3syo',
 '/lab/pomodoro:1ql3syo:0',
 '/api/analytics/collect:1ql3syo',
];
