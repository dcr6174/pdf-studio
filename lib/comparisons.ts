/**
 * What each product publishes, side by side. Rules for this file (enforced by checks/verify-claims.mjs):
 * - No numeric size, page or task limits for PDF Studio, and no absolutes such as "no limits" or "never".
 * - Every statement about another product comes from its own public page where we could read one,
 *   is attributed to that page, and is dated. We have not tested their services.
 * - Third-party listings are labelled as such, and never used for hard numbers.
 * - No superiority wording. Both sides say where the other may suit someone.
 */
export const COMPARISONS_CHECKED='4 October 2026';
export type Source={label:string;url:string;kind:'vendor'|'third-party'};
export type Row={topic:string;studio:string;other:string;source?:number};
export type Comparison={slug:string;name:string;title:string;description:string;summary:string;rows:Row[];otherSuits:string[];studioSuits:string[];sources:Source[]};

const studio={
 where:'Designed to open and process files in your browser. Site files are downloaded from our server; see “Check it yourself”.',
 account:'Core tools do not ask you to sign in.',
 watermark:'PDF Studio does not add one.',
 limits:'Does not count tasks per day or hour. Size and page limits depend on the tool and on your device’s memory, and the tool tells you when a file is too large.',
 price:'Core tools are free to use.',
 text:'Replaces supported text one line at a time; no paragraph reflow.',
 ocr:'English only, run in your browser.',
};

export const comparisons:Comparison[]=[
 {slug:'ilovepdf-alternative',name:'iLovePDF',title:'PDF Studio and iLovePDF compared',
  description:'A neutral comparison of PDF Studio and iLovePDF: what each says about where files are processed, plans and apps, with sources and the date checked.',
  summary:'iLovePDF is a long-established PDF suite with web, desktop and mobile apps and free and paid plans. PDF Studio is a smaller browser workspace designed to process files on your device. This page lists what each publishes; we have not tested iLovePDF.',
  rows:[
   {topic:'Where files are processed',studio:studio.where,other:'On its servers (web service). Its pages describe automatic deletion after a limited time.',source:1},
   {topic:'Plans and limits',studio:studio.limits,other:'Free and paid plans. What is included and the limits differ by plan; its pricing page lists them.',source:1},
   {topic:'Apps',studio:'Installable web app (PWA).',other:'Web, desktop and mobile apps.',source:1},
   {topic:'Account',studio:studio.account,other:'See its pricing page for what needs an account.',source:1},
   {topic:'Watermark',studio:studio.watermark,other:'See its pricing page.',source:1},
  ],
  otherSuits:['You want desktop or mobile apps, or tools chained into workflows.','You need conversions or features PDF Studio does not offer.','You are happy for files to be processed on a service’s servers.'],
  studioSuits:['You prefer a tool designed to process files in your browser.','You would like to start without creating an account.'],
  sources:[{label:'iLovePDF',url:'https://www.ilovepdf.com/',kind:'vendor'}]},
 {slug:'smallpdf-alternative',name:'Smallpdf',title:'PDF Studio and Smallpdf compared',
  description:'A neutral comparison of PDF Studio and Smallpdf: its published free and Pro plans, where files are processed and what PDF Studio offers, with sources and the date checked.',
  summary:'Smallpdf is a polished suite with AI tools, e-signature integration and apps. Its pricing page lists what the Free and Pro plans include. PDF Studio is a smaller browser workspace. This page lists what each publishes; we have not tested Smallpdf.',
  rows:[
   {topic:'Where files are processed',studio:studio.where,other:'On its servers (web service). It states it is ISO/IEC 27001 certified and complies with GDPR, CCPA and nFADP.',source:1},
   {topic:'Free plan',studio:studio.price,other:'Free plan with 30+ tools, limited document downloads and limited mobile app access.',source:1},
   {topic:'Pro plan',studio:'No paid plan.',other:'Lists downloads without the Free plan’s restriction, Edit Text, OCR, strong compression and AI tools.',source:1},
   {topic:'Editing existing text',studio:studio.text,other:'Listed under its Pro plan.',source:1},
   {topic:'OCR',studio:studio.ocr,other:'Listed under its Pro plan.',source:1},
   {topic:'Account',studio:studio.account,other:'Free plan and a 7-day Pro trial are described on its pricing page.',source:1},
  ],
  otherSuits:['You want AI tools, e-signature integration or mobile apps.','You need the certifications it lists.','You want paid features such as strong compression or broader OCR.'],
  studioSuits:['You want to try existing-text editing or English OCR without a paid plan.','You prefer a tool designed to process files in your browser.'],
  sources:[{label:'Smallpdf pricing',url:'https://smallpdf.com/pricing',kind:'vendor'}]},
 {slug:'sejda-alternative',name:'Sejda',title:'PDF Studio and Sejda compared',
  description:'A neutral comparison of PDF Studio and Sejda: where files are processed, free-use limits as described by third-party listings, and what PDF Studio offers, with sources and the date checked.',
  summary:'Sejda is a PDF editor available on the web and as a desktop app, known for editing existing text. Details of its free tier come from third-party listings that disagree on the numbers, so none are repeated here. We have not tested Sejda.',
  rows:[
   {topic:'Where files are processed',studio:studio.where,other:'A third-party listing says Sejda Web processes files on its servers and Sejda Desktop is a downloaded app that processes them locally.',source:2},
   {topic:'Free use',studio:studio.limits,other:'Listings describe limits on tasks, pages and file size. The figures differ between sources and over time; check Sejda’s own site for current terms.',source:2},
   {topic:'Editing existing text',studio:studio.text,other:'Sejda’s editor lets you change existing text; how it handles paragraphs and fonts varies by document.',source:2},
   {topic:'Apps',studio:'Installable web app (PWA).',other:'Web and desktop.',source:1},
   {topic:'Account',studio:studio.account,other:'Listings say free use does not require an account.',source:2},
  ],
  otherSuits:['You want a desktop app, or more than single-line text replacement.','You prefer a service that deletes files after processing and offers a local desktop version.'],
  studioSuits:['You want a browser tool with no account and no per-task counting.','You need only simple, single-line text edits.'],
  sources:[{label:'Sejda',url:'https://www.sejda.com',kind:'vendor'},{label:'Toolradar: Sejda (third-party listing)',url:'https://toolradar.com/tools/sejda',kind:'third-party'}]},
 {slug:'adobe-acrobat-alternative',name:'Adobe Acrobat online',title:'PDF Studio and Adobe Acrobat online compared',
  description:'A neutral comparison of PDF Studio and Adobe Acrobat’s free online tools: what Adobe says about sign-in, free transactions and text editing, with sources and the date checked.',
  summary:'Adobe Acrobat is the reference PDF software. Its free online tools are described on Adobe’s own pages, which differ between regions. PDF Studio is a much smaller browser workspace. We have not tested Adobe’s tools.',
  rows:[
   {topic:'Where files are processed',studio:studio.where,other:'Its online editor page describes uploading your file to Acrobat.',source:2},
   {topic:'Sign-in',studio:studio.account,other:'Its free editor page says you sign in with a free Adobe account to download or share edited files.',source:2},
   {topic:'Free use of premium tools',studio:studio.limits,other:'Its help page describes a limited number of free transactions when signed in. Terms differ between Adobe’s regional pages (including India), so check the page for your country.',source:1},
   {topic:'Editing existing text',studio:studio.text,other:'Its page says the free version of the online editor does not edit existing body text.',source:2},
   {topic:'Paid plans',studio:'No paid plan.',other:'Acrobat subscriptions add features such as text and image editing, redaction and OCR, according to Adobe.',source:3},
  ],
  otherSuits:['You need full Acrobat features, shared review or certificate-based signing.','You want an established vendor with enterprise support.'],
  studioSuits:['You want a small browser tool that does not require signing in.','You want to try single-line existing-text editing or a visual signature.'],
  sources:[{label:'Adobe: Acrobat online services FAQ',url:'https://helpx.adobe.com/document-cloud/faq/free-online-pdf.html',kind:'vendor'},{label:'Adobe: free online PDF editor',url:'https://www.adobe.com/acrobat/online/pdf-editor.html',kind:'vendor'},{label:'Adobe blog: Acrobat online tools',url:'https://blog.adobe.com/en/publish/2021/02/02/adobe-adds-new-acrobat-tools-to-tackle-pdf-tasks-in-the-browser',kind:'vendor'}]},
];
