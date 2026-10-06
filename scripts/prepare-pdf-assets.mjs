import {cp,mkdir,access} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('public/',root),{recursive:true});
for(const name of ['cmaps','standard_fonts']) await cp(new URL('node_modules/pdfjs-dist/'+name,root),new URL('public/'+name,root),{recursive:true});
await cp(new URL('node_modules/pdfjs-dist/build/pdf.worker.min.mjs',root),new URL('public/pdf.worker.min.mjs',root));
console.log('PDF.js worker, CMaps and standard fonts are ready.');

// Allow a fresh checkout to run locally before a real D1 ID is configured.
try { await access(new URL('wrangler.public.json',root)); } catch { await cp(new URL('wrangler.public.example.json',root),new URL('wrangler.public.json',root)); }
await mkdir(new URL('public/vendor/',root),{recursive:true});
await cp(new URL('node_modules/@embedpdf/pdfium/dist/pdfium.wasm',root),new URL('public/vendor/pdfium.wasm',root));
await cp(new URL('node_modules/@embedpdf/pdfium/LICENSE',root),new URL('public/vendor/PDFIUM-WRAPPER-LICENSE.txt',root));
await cp(new URL('node_modules/@embedpdf/pdfium/LICENSE.pdfium',root),new URL('public/vendor/PDFIUM-LICENSE.txt',root));


// Self-host Excalidraw fonts; no document data or text goes to a font CDN.
await mkdir(new URL('public/excalidraw/',root),{recursive:true});
await cp(new URL('node_modules/@excalidraw/excalidraw/dist/prod/fonts',root),new URL('public/excalidraw/fonts',root),{recursive:true,filter:source=>!source.includes('/Liberation')});

