import type {Metadata} from 'next';
import {pageMeta} from '@/lib/page-meta';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import Link from '@/components/browser-link';
import {CONTACT_EMAIL,mailtoLink} from '@/lib/contact';

export const metadata:Metadata=pageMeta('/contact','Contact PDF Studio: questions, problems and suggestions','Email PDF Studio with a question, a problem report or an idea. Tips for a useful report, and what not to send.');

export default function Contact(){
 const schema={'@context':'https://schema.org','@type':'ContactPage',name:'Contact PDF Studio',url:'https://pdf-studio.in/contact',mainEntity:{'@type':'Organization',name:'PDF Studio',url:'https://pdf-studio.in/',email:CONTACT_EMAIL}};
 return <main className="seo-page"><SiteHeader/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <h1>Contact PDF Studio</h1>
  <p className="lead">Questions, problems and ideas are welcome. Write to <a href={'mailto:'+CONTACT_EMAIL}>{CONTACT_EMAIL}</a>.</p>
  <div className="contact-cards">
   <a href={mailtoLink('question')}><b>Ask a question</b><span>How a tool works, what a limit means, or whether something is supported.</span></a>
   <a href={mailtoLink('problem')}><b>Report a problem</b><span>Something failed, looked wrong, or did not match what the page promised.</span></a>
   <a href={mailtoLink('suggestion')}><b>Suggest an idea</b><span>A tool, a format or a small improvement that would save you time.</span></a>
  </div>
  <p>These buttons open a draft in your own mail app. Nothing is sent until you press Send.</p>
  <h2>What helps most in a problem report</h2>
  <ul>
   <li>The tool name and the steps you took.</li>
   <li>What you expected, and what happened instead (the exact message, if there was one).</li>
   <li>Your browser and device, for example “Chrome on Android”.</li>
   <li>Whether the same thing happens with a different PDF.</li>
  </ul>
  <h2>Please do not send private documents</h2>
  <p>Do not attach contracts, ID copies, statements or anything confidential. If a file triggers the problem, describe it (size, number of pages, where it was created) or try to reproduce the problem with a harmless sample. PDF Studio never asks for your documents.</p>
  <h2>What to expect</h2>
  <p>PDF Studio is run by a small team, so replies can take a few days. We read every message. Your email address is used only to reply to you; see the <Link href="/privacy">privacy policy</Link>.</p>
  <Link className="primary" href="/">Open PDF Studio</Link>
  <SiteFooter/>
 </main>;
}
