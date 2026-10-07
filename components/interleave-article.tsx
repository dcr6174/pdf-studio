import Link from '@/components/browser-link';
import {SiteHeader,SiteFooter} from '@/components/site-header';
import {BuddyToolStory} from '@/components/buddy-tool-story';
import type {Article} from '@/lib/articles';
import '@/app/blog/interleave-article.css';
export function InterleaveArticle({article:a}:{article:Article}){
 const related=[] as Article[];
 const readOnly=['reader','blank-check','hash','privacy','audio','compare'].includes(a.toolId??'');
 const contents=[['steps','How to use it'],['check','Check the result'],['tips','Tips'],['limits','Limitations'],['questions','Questions']];
 const schema={'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.summary,datePublished:'2026-10-07',dateModified:'2026-10-07',author:{'@type':'Organization',name:'PDF Studio'},mainEntityOfPage:'https://pdf-studio.in/blog/'+a.slug};
 return <div className="blog-shell single-blog-preview"><SiteHeader/><main className="blog-main article-main">
  <nav className="blog-breadcrumb" aria-label="Breadcrumb"><Link href="/">PDF Studio</Link><span>/</span><Link href="/blog">Learn</Link><span>/</span><span aria-current="page">{a.category}</span></nav>
  <header className="article-hero"><span className="blog-eyebrow">{a.category} · Practical PDF guide</span><h1>{a.title}</h1><p className="blog-intro">{a.summary}</p><Link className="blog-primary-action" href={'/tools/'+a.tool}>{a.cta??'Skip the reading—open the tool →'}</Link><p className="article-byline">By PDF Studio · Updated <time dateTime="2026-10-07">7 October 2026</time></p></header>
  <BuddyToolStory title={a.title.replace(/^How to use /,'').split(':')[0]} steps={a.steps} check={a.check} readOnly={readOnly}/>
  <section className="interleave-example" aria-label="Example output sequence"><h2>Two stacks become one sequence</h2><p>PDF A has three pages. PDF B has two. The remaining A page stays at the end.</p><div className="interleave-sequence">{['A1','B1','A2','B2','A3'].map(label=><span key={label} className={label.startsWith('A')?'source-a':'source-b'}>{label}</span>)}</div></section><div className="article-layout"><aside className="article-contents" aria-label="On this page"><strong>On this page</strong>{contents.filter(([id])=>id!=='tips'||a.tips?.length).filter(([id])=>id!=='questions'||a.faq?.length).map(([id,label])=><a key={id} href={'#'+id}>{label}</a>)}</aside>
  <article className="article-body">
   <section id="steps"><span className="blog-eyebrow">Start here</span><h2>How to use this tool</h2><ol className="article-steps">{a.steps.map((step,i)=><li key={i}><span className="step-number" aria-hidden="true">{i+1}</span><p>{step}</p></li>)}</ol></section>
   {a.sections?.map((section,i)=><section key={i}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph,j)=><p key={j}>{paragraph}</p>)}</section>)}
   <section id="check" className="article-callout"><span className="blog-eyebrow">Before you finish</span><h2>{readOnly?'Review the findings':'Check the result'}</h2><p>{a.check}</p></section>
   {a.tips?.length&&<section id="tips"><h2>Tips that help</h2><ul className="article-tip-list">{a.tips.map((tip,i)=><li key={i}>{tip}</li>)}</ul></section>}
   <section id="limits"><h2>What this tool cannot do</h2><p>{a.limit}</p></section>
   {a.faq?.length&&<section id="questions"><h2>Your questions, answered</h2><div className="article-faq">{a.faq.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>}
   <p className="article-privacy-note">Keep your source copy. <Link href="/privacy">Privacy and local storage →</Link></p>
  </article></div>
  {related.length>0&&<section className="article-related"><span className="blog-eyebrow">Keep exploring</span><h2>More help with this task</h2><div className="native-blog-grid">{related.map(b=><Link key={b.slug} href={'/blog/'+b.slug} className="native-blog-card"><small>{b.category}</small><h3>{b.title}</h3><p>{b.summary}</p><span>Read the guide →</span></Link>)}</div></section>}
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
 </main><SiteFooter/></div>;
}
