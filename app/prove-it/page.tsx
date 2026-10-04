import type {Metadata} from 'next';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import Link from '@/components/browser-link';
import {CONTACT_EMAIL} from '@/lib/contact';

export const metadata:Metadata={
 title:'Prove it: check for yourself that PDF Studio never uploads your PDF',
 description:'Four ways to verify, in your own browser, that your PDF stays on your device: the Network tab, a search for a secret word, an offline test and a inspect usage requests that is sent.',
 alternates:{canonical:'/prove-it'},
};

const steps=[
 'Open PDF Studio and a tool such as Merge PDFs. Press F12 (or Cmd+Option+I on a Mac) and open the Network tab.',
 'Click the clear button, turn on Preserve log, then choose a PDF and run the tool.',
 'Look at the list. You will see downloads of the site’s own files, and periodic small usage requests named collect, plus an owner-access status request. None of them contains your PDF.',
 'To be sure, search all requests for a word that only appears in your PDF. Chrome and Edge: click in the Network list and press Ctrl+F (Cmd+F on a Mac). Inspect request payloads too: a text search cannot detect encoded or compressed content.',
];

export default function ProveIt(){
 const url='https://pdf-studio.in/prove-it';
 const faq:[string,string][]=[
  ['Can a website really prove that it never uploads files?','Not for all time. But you can check what your own browser sends right now, which is what matters when you open a file. These checks show it in a few minutes, without trusting our word.'],
  ['What does PDF Studio send, then?','Pages and program files are downloaded to your browser. If usage counting is on, a small request tells us a random visit number, the tool name and an event such as “opened” or “downloaded”. Never file names, contents, passwords or sizes in usage counting. You can switch it off.'],
  ['Does it work offline?','The main tools can run without a connection once the page and the tool have loaded, which is itself proof that no server was needed. Some features need a download the first time they are used, such as the OCR model and read-aloud voices.'],
 ];
 const schema={'@context':'https://schema.org','@graph':[
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'PDF Studio',item:'https://pdf-studio.in/'},{'@type':'ListItem',position:2,name:'Prove it',item:url}]},
  {'@type':'HowTo',name:'How to check that PDF Studio does not upload your PDF',step:steps.map((text,i)=>({'@type':'HowToStep',position:i+1,text}))},
  {'@type':'FAQPage',mainEntity:faq.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))},
 ]};
 return <main className="seo-page"><SiteHeader/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <h1>Prove it: your PDF stays on your device</h1>
  <p className="lead">“We never upload your files” is easy to say. Here is how to check it yourself, in your own browser, in about five minutes. You do not need to be technical, and you do not have to take our word for it.</p>

  <h2>Check 1: watch the Network tab</h2>
  <p>Every browser can show you each request a page makes. If your PDF were being uploaded, you would see it here.</p>
  <ol className="proof-steps">{steps.map(s=><li key={s}>{s}</li>)}</ol>
  <details className="proof-browser"><summary>Firefox</summary><p>Press F12, open the Network tab and leave all request types visible. Do the same steps. Right-click any request and choose Copy, then Copy Request Headers if you want to inspect one.</p></details>
  <details className="proof-browser"><summary>Safari</summary><p>Turn on the Develop menu (Safari, Settings, Advanced, “Show features for web developers”). Then Develop, Show Web Inspector, Network. Do the same steps.</p></details>
  <details className="proof-browser"><summary>Phone or tablet</summary><p>Mobile browsers hide the Network tab. Use the offline test below, or run the same steps on a computer.</p></details>

  <h2>Check 2: search for a secret word</h2>
  <p>Create a short PDF that contains a made-up word such as <b>zebra-lantern-4821</b>. Run any tool on it with the Network tab open, then search all requests for that word. No matches alone do not prove that a document stayed local: uploads can be binary, encoded or compressed. Inspect outgoing request payloads and combine this with the offline check.</p>

  <h2>Check 3: go offline</h2>
  <p>Open PDF Studio and the tool you want (for example Merge PDFs), so everything it needs has loaded. Then turn on airplane mode, or in the Network tab choose “Offline”. Add files and run the tool. If it still works, nothing needed a server.</p>
  <p>Two honest limits: the first time you use OCR it downloads a recognition model, and read-aloud uses your browser’s speech voices, which may use the network. Both are explained in the <Link href="/privacy">privacy policy</Link>.</p>

  <h2>Check 4: inspect usage requests</h2>
  <p>If anonymous usage counting is on, you will see a request called <code>collect</code> sent to PDF Studio’s own address. Click it and open Payload. It contains only a random visit number, the name of the tool and an event such as <code>tool_open</code> or <code>download</code>. Usage requests also include event IDs and timestamps for counting and deduplication. To remove even that, turn off usage counting in <b>Privacy settings</b> (in the footer), or use a browser that sends “Do Not Track” or Global Privacy Control: PDF Studio then stops optional usage events; normal site and asset requests still occur.</p>

  <h2>What may leave your device</h2>
  <div className="table-scroll"><table className="compare-table"><thead><tr><th scope="col">What</th><th scope="col">Sent to us?</th><th scope="col">Details</th></tr></thead><tbody>
   <tr><th scope="row">Your PDF, images or other documents</th><td data-label="Sent to us?">No</td><td data-label="Details">Opened and processed in your browser’s memory.</td></tr>
   <tr><th scope="row">File names, page text, passwords, signatures</th><td data-label="Sent to us?">No</td><td data-label="Details">Not included in our analytics or PDF processing requests. Network-based speech voices may receive text; use a local voice for private read-aloud.</td></tr>
   <tr><th scope="row">Usage counting</th><td data-label="Sent to us?">Small, optional</td><td data-label="Details">Random visit number, tool name and event. Records expire after 48 hours. Off with one click.</td></tr>
   <tr><th scope="row">Page requests</th><td data-label="Sent to us?">Yes, like any website</td><td data-label="Details">Your browser asks for the site’s files. The host sees an ordinary request (address, time, page).</td></tr>
   <tr><th scope="row">OCR models and speech voices</th><td data-label="Sent to us?">Depends on feature</td><td data-label="Details">OCR downloads a model and recognizes text locally. Network-based speech voices may send the text you ask them to read to the voice provider; choose a local voice for private documents.</td></tr>
   <tr><th scope="row">Saved drafts, My files, recent tools, theme</th><td data-label="Sent to us?">No</td><td data-label="Details">Stored only in this browser. You can delete them in the app or by clearing site data.</td></tr>
  </tbody></table></div>

  <h2>What these checks cannot show</h2>
  <p>They show what your browser sends now. They cannot see inside a browser extension, a compromised computer, or a future version of the site, so repeat them if you handle something very sensitive. For the most confidential documents, use the offline test or software that never touches the internet.</p>

  <h2>Questions</h2>
  {faq.map(([q,a])=><details key={q} className="proof-browser"><summary>{q}</summary><p>{a}</p></details>)}

  <p>Found something that looks wrong? Please tell us at <a href={'mailto:'+CONTACT_EMAIL}>{CONTACT_EMAIL}</a>. Do not attach private documents.</p>
  <p><Link className="primary" href="/">Open PDF Studio</Link> <Link href="/privacy">Privacy policy</Link> · <Link href="/contact">Contact</Link></p>
  <SiteFooter/>
 </main>;
}
