import Image from '@/components/browser-image';
import {ArticleSamples} from '@/components/article-samples';
import type {WorkedExample} from '@/lib/article-worked-examples';

/** Only fresh, independently inspected examples are registered here. */
export function VerifiedWorkedExample({example:e}:{example:WorkedExample}){
 const root='/examples/guide-intent/',zip=e.id==='invoice-groups';
 return <section id="worked-example">
  <h2>Reproduce this specific example</h2>
  <p><strong>Settings:</strong> {e.settings}</p>
  <p><strong>Expected labels:</strong> {e.expected}</p>
  <ArticleSamples intro="Synthetic teaching files. Run the tool yourself, then compare every page label with the checked download."
   samples={[{name:e.inputLabel,detail:'Exact synthetic input for this scenario.',href:root+e.id+'-input.pdf'}]}
   output={{href:root+e.id+'-result.'+(zip?'zip':'pdf'),label:e.outputLabel}}/>
  {e.extra&&<ul>{e.extra.map(f=><li key={f.href}><a href={f.href} download>{f.label}</a></li>)}</ul>}
  <p className="guide-byline">Engine examples checked 30 October 2026 using Node and Poppler text extraction. These assertions verify page labels, order and archive membership, not visual fidelity, production behavior or real-phone compatibility. <a href={root+'verification.json'}>Read the exact settings and recorded results</a>.</p>
  {e.screenshots?.map(s=><figure key={s.src}><Image src={s.src} width={s.width} height={s.height} loading="lazy" alt={s.alt} style={{maxWidth:'100%',height:'auto'}}/><figcaption>{s.caption}</figcaption></figure>)}
 </section>;
}
