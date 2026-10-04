/** One public address for questions, problems and suggestions. */
export const CONTACT_EMAIL='pdf.studio.in@gmail.com';
export type ContactKind='question'|'problem'|'suggestion';
const subjects:Record<ContactKind,string>={question:'PDF Studio: question',problem:'PDF Studio: problem report',suggestion:'PDF Studio: suggestion'};
const prompts:Record<ContactKind,string>={
 question:'My question:\n\n',
 problem:'What I was doing (tool, steps):\n\n\nWhat I expected:\n\n\nWhat happened instead:\n\n',
 suggestion:'My idea:\n\n\nWhy it would help:\n\n',
};
/** mailto link that opens the person's own mail app with a draft. Nothing is sent by the website. */
export function mailtoLink(kind:ContactKind,extra=''){
 const body=prompts[kind]+(extra?`\n---\n${extra}\n`:'')+'\n(Please do not attach private documents. Describe the problem or use a sample file.)\n';
 return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjects[kind])}&body=${encodeURIComponent(body)}`;
}
