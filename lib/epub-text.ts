/** Preserve block boundaries; ignore executable/hidden document content. */
export function epubHTMLText(html:string){
 const doc=new DOMParser().parseFromString(html,'text/html');
 const blocks=new Set(['P','DIV','SECTION','ARTICLE','H1','H2','H3','H4','H5','H6','LI','UL','OL','BLOCKQUOTE','PRE','TABLE','TR']);
 const walk=(node:Node):string=>{if(node.nodeType===3)return node.textContent??'';if(node.nodeType!==1)return '';const element=node as Element;const tag=element.tagName.toUpperCase();if(['SCRIPT','STYLE','NOSCRIPT','NAV'].includes(tag)||element.hasAttribute('hidden'))return '';if(tag==='BR')return '\n';const content=Array.from(node.childNodes).map(walk).join('');return blocks.has(tag)?'\n'+content+'\n':content;};
 return Array.from(doc.body.childNodes).map(walk).join('').replace(/[\t ]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
