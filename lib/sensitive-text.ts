/** Candidates only: this is not a guarantee that a document is safe to share. */
export function sensitiveTextCandidates(text:string):string[]{
 const ids=[...text.matchAll(/\b[A-Z]{5}\d{4}[A-Z]\b|\b\d{4}[ -]\d{4}[ -]\d{4}\b|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g)].map(m=>m[0]);
 const phones=[...text.matchAll(/(?<![\d+])(?:\+91[ -]?|91[ -])?[6-9](?:[ -]?\d){9}(?![\d])/g)].map(m=>m[0]);
 return [...new Set([...ids,...phones])];
}
