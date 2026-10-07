import '@/app/blog/article-samples.css';
type Sample={name:string;detail:string;href:string};
/** Verified downloads for editorial pages. Do not render on action pages. */
export function ArticleSamples({intro,samples,output}:{intro:string;samples:Sample[];output?:{href:string;label:string}}){
 return <aside className="article-samples" aria-label="Verified sample PDFs"><h3>Try the verified sample PDFs</h3><p>{intro}</p><div className="article-samples-grid">{samples.map(s=><a key={s.href} className="article-sample-download" href={s.href} download><strong>Download {s.name} ↓</strong><span>{s.detail}</span></a>)}</div>{output&&<p className="article-sample-output"><a href={output.href}>{output.label} →</a></p>}</aside>;
}
