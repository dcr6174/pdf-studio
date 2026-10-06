import {tools,type Tool} from './tools';

/**
 * Tool search that understands how people describe a job, not just tool names.
 * "reduce size", "shrink", "under 100kb" find Compress; "jpg to pdf" finds Images to PDF while
 * "pdf to jpg" finds PDF to JPG; one-letter typos ("compres", "mrege") still work.
 * Keywords are comma-separated phrases. Add words people really type; keep them honest
 * (never list something a tool cannot do).
 */
export const toolKeywords:Record<string,string>={
 'pdf-to-handwriting':'pdf to handwriting, handwritten pdf, notebook, rewrite pdf as handwriting',
 reader:'reader, read pdf, view document, reading focus, find text',
 workflow:'workflow, recipes, pipeline, sequence, chain operations',
 'split-chapters':'split chapters, bookmark boundaries, separate chapters',
 'blank-check':'blank page candidates, find empty pages, check blank pages',
 webp:'webp, web picture, page images, pdf to webp',
 'remove-bookmarks':'delete outline, remove table of contents, remove navigation',
 'remove-attachments':'embedded files, remove attachment, delete attachment, companion files',
 'remove-links':'unlink, remove hyperlinks, remove urls, disable links',
 bookmarks:'bookmark, outline, table of contents, toc, chapters, index, navigation',
 halve:'split pages in half, cut page in two, book scan, two page scan, left right pages, separate scanned pages, half',
 viewer:'reading layout, view mode, two page view, page layout, single page, spread',
 'remove-annotations':'remove comments, delete annotations, remove highlights, clean copy, strip markup, remove notes, remove stamps, remove links',
 'create-form':'fillable form, create form, form builder, text fields, interactive form, make form fillable',
 merge:'merge, combine, join, join pdfs, combine pdfs, put together, append, concatenate, one pdf, add pdf to pdf',
 organize:'organize pages, rearrange, reorder, delete pages, remove pages, delete page, remove page, rotate pages, move pages, page order, sort pages',
 split:'split, separate, extract pages, extract, page range, divide, cut, pull pages, take pages, save some pages',
 'split-all':'split every page, one page per file, single pages, burst, each page separate, zip pages, individual pages',
 compress:'compress, reduce size, reduce file size, shrink, smaller, make smaller, optimize, lower size, under 100kb, 200kb, 500kb, 1mb, kb, mb, email size, upload limit, too large, too big, resume, cv',
 rotate:'rotate, turn, sideways, upside down, landscape, portrait, fix orientation, 90 degrees, turn pages',
 reverse:'reverse pages, backwards, flip order, last page first, reverse order',
 duplicate:'duplicate pages, copy pages, repeat pages, clone page, copies',
 interleave:'interleave, alternate, mix, front and back, odd even, two sided scan, duplex scan, collate',
 nup:'pages per sheet, n-up, multiple pages per page, handout, booklet, print multiple, 2 up, 4 up',
 crop:'crop, trim, cut margins, remove margins, white borders, margin',
 resize:'resize, a4, letter, page size, change size, paper size, a3, a5, legal, fit to a4',
 flip:'mirror, flip pages, reflect, horizontal flip',
 'native-text':'edit text, edit pdf, change text, edit existing text, replace text, fix typo, update text, correct text, modify text, edit cv, edit resume, update phone number, change date, in place, pdf editor, rewrite',
 edit:'annotate, annotation, add text, text box, draw, highlight, shapes, add image, insert image, markup, comment, sticky note, write on pdf, pdf editor',
 sign:'sign, signature, e-sign, esign, electronic signature, autograph, sign document, sign form, draw signature, initials, signing',
 redact:'redact, black out, blackout, hide text, remove sensitive, censor, cover text, confidential, hide information',
 watermark:'watermark, stamp, draft, confidential stamp, logo on pages, text overlay',
 numbers:'page numbers, number pages, add numbers, pagination, page numbering',
 bates:'bates, bates numbering, legal numbering, document id, evidence numbers, discovery',
 headers:'header, footer, headers and footers, add header, add date, running title, page footer',
 flatten:'flatten, make uneditable, lock form, bake in, non editable, remove form fields',
 form:'fill form, fill pdf, application form, checkbox, fill out, form fields, complete form, form filler',
 metadata:'metadata, properties, title author, document info, edit properties, set title, change author',
 scan:'scan, scanner, camera, take photo, photo to pdf, phone scan, document scanner, capture, photograph',
 images:'images to pdf, jpg to pdf, png to pdf, photo to pdf, picture to pdf, jpeg to pdf, webp to pdf, image to pdf, combine photos, convert images',
 jpg:'pdf to jpg, pdf to jpeg, pdf to image, pdf to picture, save as image, export pages as images, page to jpg',
 png:'pdf to png, pdf to image, transparent, screenshot, lossless image',
 text:'extract text, pdf to text, pdf to txt, copy text, get text, text from pdf, plain text',
 word:'pdf to word, pdf to docx, pdf to doc, convert to word, editable word, word document',
 html:'pdf to html, convert to html, web page, website',
 epub:'pdf to epub, ebook, kindle, e-reader, ereader, book format',
 pptx:'pdf to powerpoint, pdf to ppt, pdf to pptx, slides, presentation, slideshow',
 xlsx:'pdf to excel, pdf to xlsx, pdf to spreadsheet, tables, extract tables, convert to excel',
 csv:'pdf to csv, tables to csv, comma separated, data export, extract table',
 create:'create pdf, text to pdf, txt to pdf, make pdf, new pdf, write pdf, notes to pdf, plain text to pdf',
 markdown:'markdown to pdf, md to pdf, readme to pdf, convert markdown',
 docx:'word to pdf, docx to pdf, doc to pdf, convert word, word document to pdf',
 sheet:'excel to pdf, xlsx to pdf, csv to pdf, spreadsheet to pdf, xls to pdf, sheet to pdf',
 ebook:'epub to pdf, ebook to pdf, book to pdf',
 grayscale:'grayscale, black and white, greyscale, monochrome, save ink, remove color',
 invert:'invert colors, dark mode pdf, night mode, negative, reverse colors, dark pdf',
 ocr:'ocr, searchable, make searchable, scanned pdf, recognize text, text recognition, selectable text, image to text, scan to text, copy from scan, scanned',
 audio:'read aloud, text to speech, tts, listen, speak, narrate, audio, voice, pdf to audio, pdf to speech',
 compare:'compare, diff, difference, differences, changes, two versions, side by side, version comparison, what changed',
 encrypt:'password, protect, encrypt, lock pdf, add password, secure, password protect, restrict, aes',
 decrypt:'unlock, remove password, decrypt, open protected, password removal, unprotect',
 privacy:'privacy scanner, hidden data, check metadata, sensitive info, find personal data, hidden text, before sharing',
 clean:'remove metadata, clean metadata, strip metadata, anonymize, scrub, remove author, remove properties, sanitize',
 hash:'hash, checksum, sha256, sha-256, fingerprint, verify file, file integrity, digest',
 zip:'zip, bundle, archive, download all, package files, many pdfs',
 repair:'repair, fix, broken, corrupted, damaged, cannot open, rebuild, resave, recover',
};

const STOP=new Set(['pdf','pdfs','a','an','the','to','my','me','i','how','do','can','for','of','in','on','and','or','from','into','file','files','online','free','document','documents','please','want','need','make','get','under','below','than','less','more','with','without','that','this','it','is','are','be','at','by','as']);
const popular=new Set(['merge','native-text','sign','compress','organize','images']);

export function normalize(input:string){
 return input.toLowerCase().replace(/(\d)([a-z])/g,'$1 $2').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
const words=(s:string)=>normalize(s).split(' ').filter(Boolean);

/** True when a and b differ by at most one insertion, deletion, substitution or swap of neighbours. */
function near(a:string,b:string){
 if(a===b)return true;
 const la=a.length,lb=b.length;if(Math.abs(la-lb)>1)return false;
 let i=0;while(i<la&&i<lb&&a[i]===b[i])i++;
 if(i===la||i===lb)return Math.abs(la-lb)<=1;
 if(la===lb){
  if(a.slice(i+1)===b.slice(i+1))return true;
  return a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2);
 }
 return la>lb?a.slice(i+1)===b.slice(i):b.slice(i+1)===a.slice(i);
}

type Entry={tool:Tool;order:number;name:string;nameWords:string[];phrases:string[];kwWords:string[];descWords:string[];groupWords:string[]};
const index:Entry[]=tools.map((tool,order)=>{
 const phrases=(toolKeywords[tool.id]??'').split(',').map(normalize).filter(Boolean);
 return {tool,order,name:normalize(tool.name),nameWords:words(tool.name),phrases,kwWords:[...new Set(phrases.flatMap(p=>p.split(' ')))],descWords:words(tool.description),groupWords:words(tool.group)};
});

export type SearchMode='all'|'any'|'none'|'empty';
export type SearchResult={tools:Tool[];mode:SearchMode};

function score(e:Entry,q:string,tokens:string[]){
 let total=0,matched=0;
 if(e.name===q)total+=40;else if(e.name.includes(q))total+=15;
 for(const p of e.phrases){if(p===q){total+=30;break;}if(p.includes(q))total+=10;}
 for(const t of tokens){
  let best=0;
  for(const w of e.nameWords){if(w===t)best=Math.max(best,10);else if(w.startsWith(t))best=Math.max(best,7);else if(t.length>=4&&near(t,w))best=Math.max(best,3);}
  for(const w of e.kwWords){if(w===t)best=Math.max(best,6);else if(w.startsWith(t)&&t.length>=3)best=Math.max(best,4);else if(t.length>=4&&near(t,w))best=Math.max(best,2);}
  if(!best&&e.descWords.some(w=>w===t||(t.length>=4&&w.startsWith(t))))best=2;
  if(!best&&e.groupWords.includes(t))best=1;
  if(best){matched++;total+=best;}
 }
 if(popular.has(e.tool.id))total+=.5;
 return {total,matched};
}

/** Ranked results. Every word must match; if none do, shows tools matching some words (mode "any"). */
export function searchToolsDetailed(query:string,list:Tool[]=tools):SearchResult{
 const q=normalize(query);
 if(!q)return {tools:list,mode:'empty'};
 const tokens=q.split(' ').filter(t=>!STOP.has(t)&&!/^\d+$/.test(t));
 if(!tokens.length)return {tools:list,mode:'empty'};
 const allowed=new Set(list.map(t=>t.id));
 const scored=index.filter(e=>allowed.has(e.tool.id)).map(e=>({e,...score(e,q,tokens)}));
 const rank=(a:typeof scored[number],b:typeof scored[number])=>b.total-a.total||a.e.order-b.e.order;
 const strict=scored.filter(s=>s.matched===tokens.length&&s.total>0).sort(rank);
 if(strict.length)return {tools:strict.map(s=>s.e.tool),mode:'all'};
 if(tokens.length>1){
  const loose=scored.filter(s=>s.matched>0).sort((a,b)=>b.matched-a.matched||rank(a,b));
  if(loose.length)return {tools:loose.map(s=>s.e.tool),mode:'any'};
 }
 return {tools:[],mode:'none'};
}
export const searchTools=(query:string,list:Tool[]=tools)=>searchToolsDetailed(query,list).tools;
