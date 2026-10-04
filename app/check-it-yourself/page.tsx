import type {Metadata} from 'next';
import {pageMeta} from '@/lib/page-meta';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import Link from '@/components/browser-link';
import {CONTACT_EMAIL} from '@/lib/contact';

export const metadata:Metadata=pageMeta('/check-it-yourself','Check it yourself: what PDF Studio sends from your browser','Four checks you can run in your own browser to see what PDF Studio sends while you use a tool, and what those checks can and cannot show.');

const steps=[
 'Open PDF Studio and a tool such as Merge PDFs. Press F12 (Cmd+Option+I on a Mac) and open the Network tab.',
 'Clear the list and turn on Preserve log. Choose a PDF and run the tool.',
 'Look through the requests. Expect downloads of the site’s own files (pages, scripts, styles, fonts) and, if usage counting is on, a small request named collect.',
 'Look for anything unexpected, for example a POST or PUT request whose size is close to the size of your file. If you see one, please email us.',
];

export default function CheckItYourself(){
 const url='https://pdf-studio.in/check-it-yourself';
 const faq:[string,string][]=[
  ['Do these checks prove that no file is ever uploaded?','No. They give you evidence about what your own browser sends right now, with your setup. Used together they make an unnoticed upload unlikely, but they cannot prove it for every browser, extension or future version of the site.'],
  ['What does PDF Studio send?','Pages and program files are downloaded to your browser. If usage counting is on, a small request carries a random visit number, the tool name and an event such as “opened” or “downloaded”. It is designed to carry no file names, contents, passwords or sizes. You can switch it off.'],
  ['Does it work offline?','Often, once the page and the tool have loaded, but it is not guaranteed. Some features download extra files the first time they are used, such as the OCR engine and model, and read-aloud may use online voices.'],
 ];
 const schema={'@context':'https://schema.org','@graph':[
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},{'@type':'ListItem',position:2,name:'Check it yourself',item:url}]},
  {'@type':'HowTo',name:'How to look at what PDF Studio sends from your browser',step:steps.map((text,i)=>({'@type':'HowToStep',position:i+1,text}))},
  {'@type':'FAQPage',mainEntity:faq.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))},
 ]};
 return <main className="seo-page"><SiteHeader/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <h1>Check it yourself: what does PDF Studio send?</h1>
  <p className="lead">PDF Studio is designed to process your files in your browser, not on a server. You can look at what your browser actually sends and judge for yourself. These checks give useful evidence. They are not a guarantee, and their limits are listed below.</p>

  <h2>Check 1: watch the Network tab</h2>
  <p>Every desktop browser can list the requests a page makes. If a file were being uploaded, you would normally expect to see a large request here.</p>
  <ol className="proof-steps">{steps.map(s=><li key={s}>{s}</li>)}</ol>
  <details className="proof-browser"><summary>Firefox</summary><p>Press F12, open the Network tab and choose the XHR filter. Do the same steps.</p></details>
  <details className="proof-browser"><summary>Safari</summary><p>Turn on the Develop menu (Safari, Settings, Advanced, “Show features for web developers”). Then Develop, Show Web Inspector, Network. Do the same steps.</p></details>
  <details className="proof-browser"><summary>Phone or tablet</summary><p>Phone browsers do not show a Network tab, so you have three options. (1) Run Check 3: load the tool, switch on airplane mode, then try it. (2) Use a computer and follow Check 1. (3) Inspect the phone from a computer: on Android, enable USB debugging and open chrome://inspect in desktop Chrome; on iPhone, turn on Settings, Safari, Advanced, Web Inspector, then use Safari’s Develop menu on a Mac.</p></details>

  <h2>Check 2: search for a made-up word</h2>
  <p>Create a short PDF that contains a made-up word such as <b>zebra-lantern-4821</b>. Run a tool on it with the Network tab open, then search the requests for that word (in Chrome and Edge, click in the Network list and press Ctrl+F; Cmd+F on a Mac).</p>
  <p>Finding the word in a request would be a red flag. Finding nothing is a good sign, but it is not conclusive: data can be compressed or encoded before it is sent. So also compare the Size column with the size of your file; sending a file would normally show a request about that big.</p>

  <h2>Check 3: go offline</h2>
  <p>Open PDF Studio and the tool you want (for example Merge PDFs) so the page has loaded what it needs. Then turn on airplane mode, or choose “Offline” in the Network tab, add files and run the tool.</p>
  <p>If it works with the network off, the processing itself does not need a server. If it does not work, that does not mean files are uploaded: some code is downloaded the first time a tool is used, and PDF Studio does not promise offline use. Working offline says nothing by itself about what happens when you are online, so use it together with Check 1.</p>

  <h2>Check 4: look at the one small request</h2>
  <p>If anonymous usage counting is on, you will see a request called <code>collect</code> sent to PDF Studio’s own address. Click it and open Payload. It is designed to contain only a random visit number, the name of the tool and an event such as <code>tool_open</code> or <code>download</code>, and our server rejects other fields. What your browser actually sends is what you see in the Payload tab.</p>
  <p>To stop even that, turn off usage counting in <b>Privacy settings</b> (in the footer). If your browser sends “Do Not Track” or Global Privacy Control, PDF Studio does not send usage counts at all.</p>

  <h2>What may leave your device</h2>
  <div className="table-scroll"><table className="compare-table"><thead><tr><th scope="col">What</th><th scope="col">Sent?</th><th scope="col">Details</th></tr></thead><tbody>
   <tr><th scope="row">Your PDF, images or other documents</th><td data-label="Sent?">Not by design</td><td data-label="Details">Opened and processed in your browser’s memory. If you ever see them in a request, tell us.</td></tr>
   <tr><th scope="row">File names, page text, passwords, signatures</th><td data-label="Sent?">Not by design</td><td data-label="Details">Not part of the usage request.</td></tr>
   <tr><th scope="row">Usage counting</th><td data-label="Sent?">Small, optional</td><td data-label="Details">Random visit number, tool name and event. Raw records expire after 48 hours. Can be switched off.</td></tr>
   <tr><th scope="row">Page requests</th><td data-label="Sent?">Yes, like any website</td><td data-label="Details">Your browser asks for the site’s files. The host sees an ordinary request (address, time, page).</td></tr>
   <tr><th scope="row">OCR engine and model</th><td data-label="Sent?">Downloads, possibly from other hosts</td><td data-label="Details">The first OCR run downloads an engine and an English model. By default the OCR library loads these from public content-delivery hosts, so those hosts see an ordinary download request (your address and browser). No document text is sent. Check the Network tab the first time you use OCR.</td></tr>
   <tr><th scope="row">Read aloud</th><td data-label="Sent?">Depends on your browser</td><td data-label="Details">Uses your browser’s speech voices; some browsers use online voices.</td></tr>
   <tr><th scope="row">Saved drafts, My files, recent tools, theme</th><td data-label="Sent?">No</td><td data-label="Details">Stored only in this browser. Delete them in the app or by clearing site data.</td></tr>
  </tbody></table></div>

  <h2>What these checks cannot show</h2>
  <ul>
   <li>Anything a browser extension, another tab or a compromised computer does.</li>
   <li>What the hosting provider logs about ordinary page requests.</li>
   <li>Connections that appear in other panels of your browser’s tools, or that you did not capture.</li>
   <li>Whether encoded or compressed data contains your file (which is why Check 2 is not conclusive).</li>
   <li>What a future version of the site will do. Repeat the checks after updates if it matters to you.</li>
  </ul>
  <p>For very confidential documents, use a private window with extensions off, the offline test, or software that never connects to the internet.</p>

  <h2>Questions</h2>
  {faq.map(([q,a])=><details key={q} className="proof-browser"><summary>{q}</summary><p>{a}</p></details>)}

  <p>Found something unexpected? Please tell us at <a href={'mailto:'+CONTACT_EMAIL}>{CONTACT_EMAIL}</a>. Do not attach private documents.</p>
  <p><Link className="primary" href="/">Open PDF Studio</Link> <Link href="/privacy">Privacy policy</Link> · <Link href="/contact">Contact</Link></p>
  <SiteFooter/>
 </main>;
}
