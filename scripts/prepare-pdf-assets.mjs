import {cp,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
await mkdir(new URL('public/',root),{recursive:true});
for(const name of ['cmaps','standard_fonts']) await cp(new URL('node_modules/pdfjs-dist/'+name,root),new URL('public/'+name,root),{recursive:true});
await cp(new URL('node_modules/pdfjs-dist/build/pdf.worker.min.mjs',root),new URL('public/pdf.worker.min.mjs',root));
console.log('PDF.js worker, CMaps and standard fonts are ready.');
