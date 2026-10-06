import type {Metadata} from 'next';
import {pageMeta} from '@/lib/page-meta';
import {SiteFrame} from '@/components/site-frame';
import Link from '@/components/browser-link';
import {BuddyHero} from '@/components/buddy-hero';
import {MessageCircle,Bug,Lightbulb} from 'lucide-react';
import './contact.css';
import {CONTACT_EMAIL,mailtoLink} from '@/lib/contact';

export const metadata:Metadata=pageMeta('/contact','Contact PDF Studio: questions, problems and suggestions','Email PDF Studio with a question, a problem report or an idea. Tips for a useful report, and what not to send.');

export default function Contact(){
 const schema={'@context':'https://schema.org','@type':'ContactPage',name:'Contact PDF Studio',url:'https://pdf-studio.in/contact',mainEntity:{'@type':'Organization',name:'PDF Studio',url:'https://pdf-studio.in/',email:CONTACT_EMAIL}};
 return <SiteFrame><main className="seo-page contact-page">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <section className="contact-hero"><div><span className="contact-eyebrow">A little help. A better studio.</span><h1>Let’s make PDFs easier.</h1><p>Have a question, spotted a glitch or imagined something useful? We’d love to hear from you.</p><a className="primary" href={'mailto:'+CONTACT_EMAIL}>Say hello</a></div><div className="contact-buddy"><BuddyHero/><span>Meet Buddy. Tap for a smile.</span></div></section><h2>Contact PDF Studio</h2>
  <p className="lead">Questions, problems and ideas are welcome. Write to <a target="_blank" rel="noopener noreferrer" href={'mailto:'+CONTACT_EMAIL}>{CONTACT_EMAIL}</a>.</p>
  <div className="contact-cards">
   <a target="_blank" rel="noopener noreferrer" href={mailtoLink('question')}><MessageCircle aria-hidden="true"/><b>Ask a question</b><span>How a tool works, what a limit means, or whether something is supported.</span></a>
   <a target="_blank" rel="noopener noreferrer" href={mailtoLink('problem')}><Bug aria-hidden="true"/><b>Report a problem</b><span>Something failed, looked wrong, or did not match what the page promised.</span></a>
   <a target="_blank" rel="noopener noreferrer" href={mailtoLink('suggestion')}><Lightbulb aria-hidden="true"/><b>Suggest an idea</b><span>A tool, a format or a small improvement that would save you time.</span></a>
  </div>
  <p>These buttons open a draft in your own mail app. Nothing is sent until you press Send.</p>
  <section className="contact-facts" aria-label="A few studio facts"><h2>Small facts. Big possibilities.</h2><div><article><b>PDF means Portable Document Format</b><p>It was designed to keep a document’s appearance consistent across devices.</p></article><article><b>Your browser is the workshop</b><p>PDF processing runs on your device. My files stores only the files you choose to save in this browser.</p></article><article><b>A signature can be a picture</b><p>Drawn, typed and uploaded signatures are visual marks. They are different from certificate-based digital signatures.</p></article></div></section><h2>What helps most in a problem report</h2>
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
  
 </main></SiteFrame>;
}
