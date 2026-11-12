/** Candidates only: this is not a guarantee that a document is safe to share. */
export function sensitiveTextCandidates(text:string):string[]{
 const ids=[...text.matchAll(/\b[A-Z]{5}\d{4}[A-Z]\b|\b\d{4}[ -]\d{4}[ -]\d{4}\b|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g)].map(m=>m[0]);
 const international=[...text.matchAll(/(?<![\w+])(?:\+\d{1,3}[ .-]?(?:\(\d{1,4}\)[ .-]?)?(?:\d[ .-]?){6,14}\d|(?:\(\d{3}\)|\d{3})[ .-]\d{3}[ .-]\d{4})(?!\w)/g)].map(m=>m[0]).filter(n=>{const count=n.replace(/\D/g,'').length;return count>=8&&count<=15;});
 const phones=[...text.matchAll(/(?<![\d+])(?:\+91[ -]?|91[ -])?[6-9](?:[ -]?\d){9}(?![\d])/g)].map(m=>m[0]);
 const landlines=[...text.matchAll(/(?<![\d+(])\(?0\d{2,4}\)?[ -]?\d{3,4}[ -]?\d{4}(?!\d)/g)].map(m=>m[0]).filter(n=>{const count=n.replace(/\D/g,'').length;return count>=10&&count<=11;});
 return [...new Set([...ids,...phones,...landlines,...international])];
}
