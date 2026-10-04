/** Honest, dated comparisons. Competitor facts come from their own pages where possible;
 *  limits change often, so pages tell readers to confirm on the linked source. */
export type Comparison={slug:string;name:string;title:string;description:string;summary:string;
 rows:[string,string,string][];theyAreBetter:string[];weAreBetter:string[];sources:{label:string;url:string}[]};
export const COMPARISONS_CHECKED='4 October 2026';
const studio={processing:'In your browser; documents are not uploaded',account:'Not needed',watermark:'None',limits:'No daily task quota. Technical validation limits depend on the workflow and your device. Rejected inputs receive a specific explanation.',price:'Free'};
export const comparisons:Comparison[]=[
 {slug:'ilovepdf-alternative',name:'iLovePDF',title:'PDF Studio vs iLovePDF',
  description:'An honest comparison of PDF Studio and iLovePDF: where files are processed, free limits, accounts and when iLovePDF is the better choice.',
  summary:'iLovePDF is a mature, multi-platform PDF suite with many conversions. PDF Studio keeps your documents on your device and has no task limits, but offers fewer conversions and no desktop app.',
  rows:[['Where files are processed',studio.processing,'On iLovePDF servers (web service)'],['Account',studio.account,'Not needed for basic use'],['Free limits',studio.limits,'Per-tool file size and batch limits on the free plan; Premium raises or removes them'],['Watermark',studio.watermark,'None on standard tools'],['Apps','Installable web app (PWA)','Web, desktop and mobile apps'],['Price',studio.price,'Free plan plus paid Premium and Business plans']],
  theyAreBetter:['More Office conversions in both directions and OCR options. Check the current plan for per-tool limits.','Desktop and mobile apps, team plans and an API.','Many interface languages.'],
  weAreBetter:['Documents never leave your device, which suits contracts, IDs and medical papers.','No daily task quota and no account. Technical batch validation still applies.','Edit existing PDF text for free.'],
  sources:[{label:'iLovePDF pricing',url:'https://www.ilovepdf.com/pricing'}]},
 {slug:'smallpdf-alternative',name:'Smallpdf',title:'PDF Studio vs Smallpdf',
  description:'PDF Studio compared with Smallpdf: free plan limits, text editing, OCR, privacy and which one to use.',
  summary:'Smallpdf is a polished suite with AI tools, e-signatures and apps. Its free plan limits downloads; text editing, OCR and strong compression are in Pro. PDF Studio is free without download limits and processes files on your device.',
  rows:[['Where files are processed',studio.processing,'On Smallpdf servers (web service)'],['Account','Not needed','Free plan available; Pro has a 7-day trial'],['Free limits',studio.limits,'Free plan has limited document downloads and limited mobile app access'],['Edit existing text','Free (single-line replacements)','Pro plan'],['OCR','English, free','Pro plan'],['Price',studio.price,'Free plan plus Pro and Team subscriptions']],
  theyAreBetter:['AI tools such as chat with PDF and summaries.','E-signature workflows with Sign.com and mobile apps.','Security certifications for business buyers (ISO/IEC 27001, GDPR).'],
  weAreBetter:['No download limits on the free tools.','Existing-text editing and English OCR are free.','Files stay on your device.'],
  sources:[{label:'Smallpdf pricing',url:'https://smallpdf.com/pricing'}]},
 {slug:'sejda-alternative',name:'Sejda',title:'PDF Studio vs Sejda',
  description:'PDF Studio compared with Sejda: free task limits, existing-text editing, privacy and the desktop app.',
  summary:'Sejda offers web editing of existing PDF text, and it also has a desktop app. Its free web tier has task, page and file-size limits. PDF Studio has no task limits and processes files in your browser.',
  rows:[['Where files are processed',studio.processing,'Sejda Web: on Sejda servers. Sejda Desktop: on your computer'],['Account','Not needed','Not needed for free use'],['Free limits',studio.limits,'Free use is limited by tasks, pages and file size; paid passes remove the limits'],['Edit existing text','Free, single-line replacements','Free within limits; better paragraph handling'],['Price',studio.price,'Free tier plus week, monthly and annual passes']],
  theyAreBetter:['More capable text editing (paragraphs and font matching on well-structured PDFs).','A full desktop app.','OCR and more page tools in the paid plans.'],
  weAreBetter:['No hourly or daily task limits.','Nothing is uploaded, even on the web.','No account or pass needed for any tool.'],
  sources:[{label:'Sejda',url:'https://www.sejda.com'}]},
 {slug:'adobe-acrobat-alternative',name:'Adobe Acrobat online',title:'PDF Studio vs Adobe Acrobat online',
  description:'PDF Studio compared with Adobe Acrobat’s free online tools: sign-in requirements, free transactions, text editing and privacy.',
  summary:'Adobe Acrobat is the reference PDF software. Its free online editor focuses on annotations rather than existing body text. Sign-in and free usage terms vary by tool and region; Adobe currently advertises unlimited online tool use with a free account in India. PDF Studio needs no account and has no transaction limits.',
  rows:[['Where files are processed',studio.processing,'On Adobe servers (online tools)'],['Account','Not needed','Sign-in with an Adobe ID for most free features; without it, one free transaction'],['Free limits',studio.limits,'Terms vary by tool and region. The global FAQ describes transaction limits; the India page advertises unlimited online tool use with a free account (excluding AI).'],['Edit existing text','Free (single-line replacements)','Not in the free online editor; needs an Acrobat subscription'],['Price',studio.price,'Free online tools plus Acrobat subscriptions']],
  theyAreBetter:['Full-featured editing, redaction, OCR and certified digital signatures in paid Acrobat.','Cloud storage, sharing and review workflows.','Industry-standard compatibility and support.'],
  weAreBetter:['No sign-in and no transaction counting.','Existing-text editing is free.','Files stay on your device.'],
  sources:[{label:'Adobe India online tools',url:'https://www.adobe.com/in/acrobat/online.html'},{label:'Adobe: Acrobat online services FAQ',url:'https://helpx.adobe.com/document-cloud/faq/try-acrobat-online-services.html'},{label:'Adobe: free online PDF editor',url:'https://www.adobe.com/acrobat/online/pdf-editor.html'}]},
];
