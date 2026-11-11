import {legacyMetadataPaths} from './legacy-metadata-paths';

const recoverableMetadataPaths = new Set<string>(legacyMetadataPaths);

/** Redirect only duplicate tasks; retain different output modes and guides. */
export const canonicalToolRoutes:Record<string,string>={
 'delete-pdf-pages':'organize-pdf',
 'extract-pdf-pages':'split-pdf',
 'compress-pdf-to-100kb':'compress-pdf',
 'resize-to-a4':'resize-pages',
 'pdf-editor':'add-text-and-images',
 'edit-pdf':'add-text-and-images',
 'edit-cv-pdf':'edit-pdf-text',
 'jpg-to-pdf':'images-to-pdf',
 'png-to-pdf':'images-to-pdf',
 'pdf-to-excel':'pdf-to-spreadsheet',
 'text-to-pdf':'create-pdf',
 'txt-to-pdf':'create-pdf'
};

/** Resolve legacy public links in one permanent hop, without losing queries. */
export function canonicalPublicPath(path: string): string {
 let clean=path==='/'?path:path.replace(/\/+$/,'');
 // Accept encoded colons only when they match an explicitly verified address.
 const historical=clean.replace(/%3a/gi,':');
 if(recoverableMetadataPaths.has(historical))clean=historical.slice(0,historical.lastIndexOf(':'));
 const match=clean.match(/^\/(tools|guides)\/([^/]+)$/);
 if(match){
  const [,section,slug]=match;
  if(section==='tools'&&['html-to-pdf','powerpoint-to-pdf'].includes(slug))return '/guides/'+slug;
  return '/'+section+'/'+(canonicalToolRoutes[slug]??slug);
 }
 if(clean==='/prove-it')return '/check-it-yourself';
 if(clean==='/lab/sketch-pdf')return '/tools/sketch-over-pdf';
 if(clean==='/creative/pdf-to-handwriting')return '/tools/pdf-to-handwriting';
 if(/^\/creative\/(text-to-handwriting|notebook-maker|handwriting-practice)$/.test(clean))return clean.replace('/creative/','/lab/');
 return clean;
}

export function canonicalPublicRedirect(request: Request): URL | null {
 if(!['GET','HEAD'].includes(request.method))return null;
 const original=new URL(request.url);
 if(original.pathname==='/api'||original.pathname.startsWith('/api/'))return null;
 const canonical=new URL(original);
 canonical.pathname=canonicalPublicPath(canonical.pathname);
 if(['pdf-studio.in','www.pdf-studio.in'].includes(canonical.hostname)||canonical.hostname.endsWith('.workers.dev')){
  canonical.hostname='pdf-studio.in';
  canonical.protocol='https:';
 }
 return canonical.href===original.href?null:canonical;
}
